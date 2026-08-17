import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { useAuth } from "../../context/AuthContext";
import {
  getAdminRecord,
  getPhotoUrl,
  saveAdminRecord,
  uploadOffenderPhoto,
} from "../../services/admin";
import "./Admin.css";

const parishes = [
  "",
  "Charlotte",
  "Grenadines",
  "Saint Andrew",
  "Saint David",
  "Saint George",
  "Saint Patrick",
];

const emptyConviction = () => ({
  offence: "",
  court: "",
  convictionDate: "",
  caseReference: "",
  notes: "",
});

const emptySentence = () => ({
  sentence: "",
  sentenceDate: "",
  court: "",
  notes: "",
});

const emptyLocation = () => ({
  area: "",
  parish: "",
  locationType: "General location",
  lastVerified: "",
});

const emptySource = () => ({
  title: "",
  publisher: "",
  publishedDate: "",
  sourceReference: "",
  url: "",
});

const emptyForm = () => ({
  id: null,
  slug: "",
  firstName: "",
  lastName: "",
  birthYear: "",
  primaryLocation: "",
  parish: "",
  photoPath: "",
  photoUrl: null,
  status: "draft",
  referenceId: "",
  publicFrom: "",
  publicUntil: "",
  lastReviewedAt: "",
  convictions: [],
  sentences: [],
  locations: [],
  sources: [],
});

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function Section({ title, description, action, children }) {
  return (
    <section className="admin-editor-section">
      <div className="admin-editor-section-heading">
        <div>
          <h2>{title}</h2>
          {description && <p>{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function RemoveButton({ onClick }) {
  return (
    <button type="button" className="admin-remove-button" onClick={onClick}>
      Remove
    </button>
  );
}

export default function AdminRecordEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canEdit } = useAuth();

  const editing = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    if (!editing) return;

    let active = true;

    getAdminRecord(id)
      .then((record) => {
        if (!active) return;

        if (!record) {
          setError("Record not found.");
          return;
        }

        setForm(record);
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load record.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [editing, id]);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(null);
      return;
    }

    const url = URL.createObjectURL(photoFile);
    setPhotoPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [photoFile]);

  const displayPhoto = useMemo(
    () => photoPreview || form.photoUrl || (form.photoPath ? getPhotoUrl(form.photoPath) : null),
    [photoPreview, form.photoUrl, form.photoPath],
  );

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  function updateIdentity(name, value) {
    setForm((current) => {
      const next = { ...current, [name]: value };

      if (!editing && !current.slug) {
        next.slug = slugify(
          `${name === "firstName" ? value : current.firstName}-${
            name === "lastName" ? value : current.lastName
          }`,
        );
      }

      return next;
    });
  }

  function updateArray(section, index, field, value) {
    setForm((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  function addArrayItem(section, factory) {
    setForm((current) => ({
      ...current,
      [section]: [...current[section], factory()],
    }));
  }

  function removeArrayItem(section, index) {
    setForm((current) => ({
      ...current,
      [section]: current[section].filter((_, itemIndex) => itemIndex !== index),
    }));
  }

  function validate() {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    if (!form.slug.trim()) return "Slug is required.";
    if (!form.referenceId.trim()) return "Record reference is required.";

    if (form.publicFrom && form.publicUntil && form.publicUntil < form.publicFrom) {
      return "Public until date cannot be before public from date.";
    }

    if (form.status === "published" && form.sources.filter((item) => item.title.trim()).length === 0) {
      return "Add at least one source before publishing a record.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!canEdit) {
      setError("Your admin role is read-only.");
      return;
    }

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      let photoPath = form.photoPath;

      if (photoFile) {
        photoPath = await uploadOffenderPhoto(photoFile, form.photoPath);
      }

      const recordId = await saveAdminRecord({
        ...form,
        photoPath,
      });

      setSuccess("Record saved successfully.");

      if (!editing) {
        navigate(`/admin/records/${recordId}/edit`, { replace: true });
      } else {
        const refreshed = await getAdminRecord(recordId);
        if (refreshed) setForm(refreshed);
      }

      setPhotoFile(null);
    } catch (err) {
      setError(err.message || "Unable to save record.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="admin-loading-panel">Loading record…</div>;
  }

  return (
    <div className="admin-page admin-editor-page">
      <div className="admin-page-header admin-editor-header">
        <div>
          <p className="admin-eyebrow">Registry records</p>
          <h1>{editing ? "Edit record" : "Add record"}</h1>
          <p>
            {editing
              ? "Update the public profile, evidence, and publication settings."
              : "Create a new registry profile. New records start as drafts unless you choose another status."}
          </p>
        </div>

        <Link to="/admin/records" className="admin-secondary-link">
          Back to records
        </Link>
      </div>

      {!canEdit && (
        <div className="admin-alert admin-alert-warning">
          Your administrator role is read-only. You can inspect this record but cannot save changes.
        </div>
      )}

      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {success && <div className="admin-alert admin-alert-success">{success}</div>}

      <form className="admin-editor-form" onSubmit={handleSubmit}>
        <div className="admin-editor-grid">
          <div className="admin-editor-main">
            <Section
              title="Identity"
              description="Core identifying and location information shown on the public profile."
            >
              <div className="admin-form-grid two-column">
                <label>
                  <span>First name *</span>
                  <input
                    value={form.firstName}
                    onChange={(event) => updateIdentity("firstName", event.target.value)}
                    disabled={!canEdit}
                    required
                  />
                </label>

                <label>
                  <span>Last name *</span>
                  <input
                    value={form.lastName}
                    onChange={(event) => updateIdentity("lastName", event.target.value)}
                    disabled={!canEdit}
                    required
                  />
                </label>

                <label>
                  <span>Birth year</span>
                  <input
                    type="number"
                    min="1900"
                    max="2100"
                    value={form.birthYear}
                    onChange={(event) => updateField("birthYear", event.target.value)}
                    disabled={!canEdit}
                  />
                </label>

                <label>
                  <span>Parish</span>
                  <select
                    value={form.parish}
                    onChange={(event) => updateField("parish", event.target.value)}
                    disabled={!canEdit}
                  >
                    {parishes.map((parish) => (
                      <option key={parish || "none"} value={parish}>
                        {parish || "Select parish"}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="admin-field-full">
                  <span>General location</span>
                  <input
                    value={form.primaryLocation}
                    onChange={(event) => updateField("primaryLocation", event.target.value)}
                    disabled={!canEdit}
                    placeholder="e.g. Kingstown"
                  />
                </label>

                <label>
                  <span>URL slug *</span>
                  <input
                    value={form.slug}
                    onChange={(event) => updateField("slug", slugify(event.target.value))}
                    disabled={!canEdit}
                    required
                  />
                </label>

                <label>
                  <span>Record reference *</span>
                  <input
                    value={form.referenceId}
                    onChange={(event) => updateField("referenceId", event.target.value.toUpperCase())}
                    disabled={!canEdit}
                    placeholder="SVGOR-2026-0001"
                    required
                  />
                </label>
              </div>
            </Section>

            <Section
              title="Convictions"
              description="Add only conviction information supported by an authoritative source."
              action={
                canEdit ? (
                  <button
                    type="button"
                    className="admin-add-button"
                    onClick={() => addArrayItem("convictions", emptyConviction)}
                  >
                    Add conviction
                  </button>
                ) : null
              }
            >
              {form.convictions.length === 0 ? (
                <div className="admin-inline-empty">No convictions added yet.</div>
              ) : (
                <div className="admin-repeat-list">
                  {form.convictions.map((item, index) => (
                    <article className="admin-repeat-card" key={`conviction-${index}`}>
                      <div className="admin-repeat-heading">
                        <strong>Conviction {index + 1}</strong>
                        {canEdit && (
                          <RemoveButton onClick={() => removeArrayItem("convictions", index)} />
                        )}
                      </div>

                      <div className="admin-form-grid two-column">
                        <label className="admin-field-full">
                          <span>Offence *</span>
                          <input
                            value={item.offence}
                            onChange={(event) =>
                              updateArray("convictions", index, "offence", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>

                        <label>
                          <span>Conviction date</span>
                          <input
                            type="date"
                            value={item.convictionDate}
                            onChange={(event) =>
                              updateArray("convictions", index, "convictionDate", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>

                        <label>
                          <span>Court</span>
                          <input
                            value={item.court}
                            onChange={(event) =>
                              updateArray("convictions", index, "court", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>

                        <label className="admin-field-full">
                          <span>Case reference</span>
                          <input
                            value={item.caseReference}
                            onChange={(event) =>
                              updateArray("convictions", index, "caseReference", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>

                        <label className="admin-field-full">
                          <span>Notes</span>
                          <textarea
                            rows="3"
                            value={item.notes}
                            onChange={(event) =>
                              updateArray("convictions", index, "notes", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Section>

            <Section
              title="Sentences"
              description="Record sentencing details associated with the convictions above."
              action={
                canEdit ? (
                  <button
                    type="button"
                    className="admin-add-button"
                    onClick={() => addArrayItem("sentences", emptySentence)}
                  >
                    Add sentence
                  </button>
                ) : null
              }
            >
              {form.sentences.length === 0 ? (
                <div className="admin-inline-empty">No sentences added yet.</div>
              ) : (
                <div className="admin-repeat-list">
                  {form.sentences.map((item, index) => (
                    <article className="admin-repeat-card" key={`sentence-${index}`}>
                      <div className="admin-repeat-heading">
                        <strong>Sentence {index + 1}</strong>
                        {canEdit && (
                          <RemoveButton onClick={() => removeArrayItem("sentences", index)} />
                        )}
                      </div>

                      <div className="admin-form-grid two-column">
                        <label className="admin-field-full">
                          <span>Sentence *</span>
                          <input
                            value={item.sentence}
                            onChange={(event) =>
                              updateArray("sentences", index, "sentence", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>

                        <label>
                          <span>Sentence date</span>
                          <input
                            type="date"
                            value={item.sentenceDate}
                            onChange={(event) =>
                              updateArray("sentences", index, "sentenceDate", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>

                        <label>
                          <span>Court</span>
                          <input
                            value={item.court}
                            onChange={(event) =>
                              updateArray("sentences", index, "court", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>

                        <label className="admin-field-full">
                          <span>Notes</span>
                          <textarea
                            rows="3"
                            value={item.notes}
                            onChange={(event) =>
                              updateArray("sentences", index, "notes", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Section>

            <Section
              title="General locations"
              description="Use general areas only; avoid exact residential addresses unless specifically authorized."
              action={
                canEdit ? (
                  <button
                    type="button"
                    className="admin-add-button"
                    onClick={() => addArrayItem("locations", emptyLocation)}
                  >
                    Add location
                  </button>
                ) : null
              }
            >
              {form.locations.length === 0 ? (
                <div className="admin-inline-empty">No additional locations added.</div>
              ) : (
                <div className="admin-repeat-list">
                  {form.locations.map((item, index) => (
                    <article className="admin-repeat-card" key={`location-${index}`}>
                      <div className="admin-repeat-heading">
                        <strong>Location {index + 1}</strong>
                        {canEdit && (
                          <RemoveButton onClick={() => removeArrayItem("locations", index)} />
                        )}
                      </div>

                      <div className="admin-form-grid two-column">
                        <label>
                          <span>Area *</span>
                          <input
                            value={item.area}
                            onChange={(event) =>
                              updateArray("locations", index, "area", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>

                        <label>
                          <span>Parish</span>
                          <select
                            value={item.parish}
                            onChange={(event) =>
                              updateArray("locations", index, "parish", event.target.value)
                            }
                            disabled={!canEdit}
                          >
                            {parishes.map((parish) => (
                              <option key={parish || "none"} value={parish}>
                                {parish || "Select parish"}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label>
                          <span>Location type</span>
                          <input
                            value={item.locationType}
                            onChange={(event) =>
                              updateArray("locations", index, "locationType", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>

                        <label>
                          <span>Last verified</span>
                          <input
                            type="date"
                            value={item.lastVerified}
                            onChange={(event) =>
                              updateArray("locations", index, "lastVerified", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Section>

            <Section
              title="Sources"
              description="Every published profile should be supported by traceable source material."
              action={
                canEdit ? (
                  <button
                    type="button"
                    className="admin-add-button"
                    onClick={() => addArrayItem("sources", emptySource)}
                  >
                    Add source
                  </button>
                ) : null
              }
            >
              {form.sources.length === 0 ? (
                <div className="admin-inline-empty">No sources added yet.</div>
              ) : (
                <div className="admin-repeat-list">
                  {form.sources.map((item, index) => (
                    <article className="admin-repeat-card" key={`source-${index}`}>
                      <div className="admin-repeat-heading">
                        <strong>Source {index + 1}</strong>
                        {canEdit && (
                          <RemoveButton onClick={() => removeArrayItem("sources", index)} />
                        )}
                      </div>

                      <div className="admin-form-grid two-column">
                        <label className="admin-field-full">
                          <span>Source title *</span>
                          <input
                            value={item.title}
                            onChange={(event) =>
                              updateArray("sources", index, "title", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>

                        <label>
                          <span>Publisher</span>
                          <input
                            value={item.publisher}
                            onChange={(event) =>
                              updateArray("sources", index, "publisher", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>

                        <label>
                          <span>Published date</span>
                          <input
                            type="date"
                            value={item.publishedDate}
                            onChange={(event) =>
                              updateArray("sources", index, "publishedDate", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>

                        <label>
                          <span>Source reference</span>
                          <input
                            value={item.sourceReference}
                            onChange={(event) =>
                              updateArray("sources", index, "sourceReference", event.target.value)
                            }
                            disabled={!canEdit}
                          />
                        </label>

                        <label>
                          <span>Source URL</span>
                          <input
                            type="url"
                            value={item.url}
                            onChange={(event) =>
                              updateArray("sources", index, "url", event.target.value)
                            }
                            disabled={!canEdit}
                            placeholder="https://…"
                          />
                        </label>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </Section>
          </div>

          <aside className="admin-editor-sidebar">
            <section className="admin-side-card">
              <h2>Publication</h2>

              <label>
                <span>Status</span>
                <select
                  value={form.status}
                  onChange={(event) => updateField("status", event.target.value)}
                  disabled={!canEdit}
                >
                  <option value="draft">Draft</option>
                  <option value="review">Needs review</option>
                  <option value="published">Published</option>
                  <option value="removed">Removed</option>
                </select>
              </label>

              <label>
                <span>Public from</span>
                <input
                  type="date"
                  value={form.publicFrom}
                  onChange={(event) => updateField("publicFrom", event.target.value)}
                  disabled={!canEdit}
                />
              </label>

              <label>
                <span>Public until</span>
                <input
                  type="date"
                  value={form.publicUntil}
                  onChange={(event) => updateField("publicUntil", event.target.value)}
                  disabled={!canEdit}
                />
              </label>

              <label>
                <span>Last reviewed</span>
                <input
                  type="date"
                  value={form.lastReviewedAt}
                  onChange={(event) => updateField("lastReviewedAt", event.target.value)}
                  disabled={!canEdit}
                />
              </label>

              <p className="admin-side-help">
                A published record is publicly searchable only while its publication window is active.
              </p>
            </section>

            <section className="admin-side-card">
              <h2>Profile photo</h2>

              <div className="admin-photo-preview">
                {displayPhoto ? (
                  <img src={displayPhoto} alt="Current profile" />
                ) : (
                  <span>No photo</span>
                )}
              </div>

              {canEdit && (
                <label className="admin-file-field">
                  <span>Choose image</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => setPhotoFile(event.target.files?.[0] || null)}
                  />
                </label>
              )}

              <p className="admin-side-help">JPG, PNG, or WebP. Maximum 5 MB.</p>
            </section>

            {canEdit && (
              <div className="admin-save-card">
                <button type="submit" disabled={saving}>
                  {saving ? "Saving…" : editing ? "Save changes" : "Create record"}
                </button>

                <p>
                  Saving replaces the record's conviction, sentence, location, and source detail rows with the values currently shown in this editor.
                </p>
              </div>
            )}
          </aside>
        </div>
      </form>
    </div>
  );
}
