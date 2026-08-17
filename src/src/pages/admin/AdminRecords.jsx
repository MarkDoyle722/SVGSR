import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

import { useAuth } from "../../context/AuthContext";
import { deleteAdminRecord, listAdminRecords } from "../../services/admin";
import "./Admin.css";

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminRecords() {
  const { canEdit } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [deleting, setDeleting] = useState("");

  async function loadRecords() {
    setLoading(true);
    setError("");

    try {
      setRecords(await listAdminRecords());
    } catch (err) {
      setError(err.message || "Unable to load records.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  const filtered = useMemo(() => {
    const needle = normalize(query);

    return records.filter((record) => {
      const matchesStatus = status === "all" || record.status === status;

      const haystack = normalize(
        `${record.first_name} ${record.last_name} ${record.reference_id} ${record.primary_location} ${record.parish}`,
      );

      const matchesQuery = !needle || haystack.includes(needle);

      return matchesStatus && matchesQuery;
    });
  }, [records, query, status]);

  async function handleDelete(record) {
    if (!canEdit) return;

    const confirmed = window.confirm(
      `Delete ${record.first_name} ${record.last_name}? This permanently removes the record and its related data.`,
    );

    if (!confirmed) return;

    setDeleting(record.id);
    setError("");

    try {
      await deleteAdminRecord(record.id);
      setRecords((current) => current.filter((item) => item.id !== record.id));
    } catch (err) {
      setError(err.message || "Unable to delete record.");
    } finally {
      setDeleting("");
    }
  }

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Registry records</p>
          <h1>Records</h1>
          <p>Create, review, publish, unpublish, and update registry profiles.</p>
        </div>

        {canEdit && (
          <Link to="/admin/records/new" className="admin-primary-link">
            Add record
          </Link>
        )}
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      <section className="admin-panel admin-records-panel">
        <div className="admin-record-filters">
          <label>
            <span>Search records</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Name, reference, location…"
            />
          </label>

          <label>
            <span>Status</span>
            <select value={status} onChange={(event) => setStatus(event.target.value)}>
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="review">Review</option>
              <option value="removed">Removed</option>
            </select>
          </label>
        </div>

        <div className="admin-table-summary">
          {loading ? "Loading…" : `${filtered.length} record${filtered.length === 1 ? "" : "s"}`}
        </div>

        {!loading && filtered.length > 0 && (
          <div className="admin-record-table-wrap">
            <table className="admin-record-table">
              <thead>
                <tr>
                  <th>Record</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Convictions</th>
                  <th>Reviewed</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>

              <tbody>
                {filtered.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <strong>
                        {record.first_name} {record.last_name}
                      </strong>
                      <span>{record.reference_id}</span>
                    </td>

                    <td>
                      <span className={`admin-status admin-status-${record.status}`}>
                        {record.status}
                      </span>
                    </td>

                    <td>
                      {record.primary_location || "—"}
                      {record.parish ? `, ${record.parish}` : ""}
                    </td>

                    <td>{record.convictions?.[0]?.count ?? 0}</td>
                    <td>{formatDate(record.last_reviewed_at)}</td>

                    <td>
                      <div className="admin-table-actions">
                        <Link to={`/admin/records/${record.id}/edit`}>
                          {canEdit ? "Edit" : "View"}
                        </Link>

                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => handleDelete(record)}
                            disabled={deleting === record.id}
                          >
                            {deleting === record.id ? "Deleting…" : "Delete"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="admin-empty">No records match those filters.</div>
        )}
      </section>
    </div>
  );
}
