import { useEffect, useState } from "react";
import { Link } from "react-router";

import { useAuth } from "../../context/AuthContext";
import { getAdminStats } from "../../services/admin";
import "./Admin.css";

function formatDate(value) {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default function AdminDashboard() {
  const { canEdit } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getAdminStats()
      .then((data) => {
        if (active) setStats(data);
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load dashboard.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="admin-page">
      <div className="admin-page-header">
        <div>
          <p className="admin-eyebrow">Registry administration</p>
          <h1>Dashboard</h1>
          <p>Review publication status and manage registry records.</p>
        </div>

        {canEdit && (
          <Link to="/admin/records/new" className="admin-primary-link">
            Add record
          </Link>
        )}
      </div>

      {error && <div className="admin-alert admin-alert-error">{error}</div>}

      {loading ? (
        <div className="admin-loading-panel">Loading dashboard…</div>
      ) : stats ? (
        <>
          <section className="admin-stat-grid" aria-label="Registry statistics">
            <article>
              <span>Total records</span>
              <strong>{stats.total}</strong>
            </article>

            <article>
              <span>Published</span>
              <strong>{stats.published}</strong>
            </article>

            <article>
              <span>Drafts</span>
              <strong>{stats.draft}</strong>
            </article>

            <article>
              <span>Needs review</span>
              <strong>{stats.review}</strong>
            </article>

            <article>
              <span>New corrections</span>
              <strong>{stats.corrections}</strong>
            </article>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-heading">
              <div>
                <h2>Recently updated</h2>
                <p>Latest changes across registry records.</p>
              </div>

              <Link to="/admin/records">View all records</Link>
            </div>

            {stats.recent.length ? (
              <div className="admin-recent-list">
                {stats.recent.map((record) => (
                  <Link
                    key={record.id}
                    to={`/admin/records/${record.id}/edit`}
                    className="admin-recent-row"
                  >
                    <div>
                      <strong>
                        {record.first_name} {record.last_name}
                      </strong>
                      <span>{record.reference_id}</span>
                    </div>

                    <div className={`admin-status admin-status-${record.status}`}>
                      {record.status}
                    </div>

                    <time>{formatDate(record.updated_at)}</time>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="admin-empty">No registry records yet.</div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}
