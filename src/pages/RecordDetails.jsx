import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getRecordBySlug } from "../services/records";

import "../App.css";
import "./RecordDetails.css";

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M19 12H5M10 7l-5 5 5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 12h13M14 7l5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle
        cx="12"
        cy="10"
        r="2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M14 3v5h5M9 12h6M9 16h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 3v3M18 3v3M4 9h16M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 3 19 6v5c0 4.8-2.9 8.1-7 10-4.1-1.9-7-5.2-7-10V6l7-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9.5 12.2 11.2 14l3.7-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function formatDate(value) {
  if (!value) return "Not recorded";

  const raw = String(value).slice(0, 10);
  const date = new Date(`${raw}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function PageHeader() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link
          to="/search"
          className="header-control"
          aria-label="Back to search results"
        >
          <BackIcon />
        </Link>

        <Link className="brand" to="/" aria-label="SVGSR home">
          <span className="brand-main">SVGSR</span>
          <span className="brand-sub">
            Sexual Offence Conviction Records
          </span>
        </Link>

        <div className="record-header-spacer" aria-hidden="true" />
      </div>

      <div className="national-line" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </header>
  );
}

function ProfilePhoto({ record }) {
  const [failed, setFailed] = useState(false);

  const initials =
    `${record.firstName?.[0] || ""}${record.lastName?.[0] || ""}`
      .toUpperCase()
      .trim();

  if (record.photoUrl && !failed) {
    return (
      <img
        className="profile-photo"
        src={record.photoUrl}
        alt={`${record.firstName} ${record.lastName}`}
        loading="eager"
        decoding="async"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className="profile-photo-placeholder" aria-hidden="true">
      <span>{initials || "—"}</span>
      <small>No photo</small>
    </div>
  );
}

function RecordDetails() {
  const { slug } = useParams();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await getRecordBySlug(slug);

        if (!cancelled) {
          setRecord(data);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(
            "We could not load this record from the database.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="site">
        <PageHeader />

        <main className="record-state-page">
          <div className="container record-state-card">
            <p className="section-label">Record profile</p>
            <h1>Loading record</h1>
            <p>Retrieving the published profile…</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="site">
        <PageHeader />

        <main className="record-state-page">
          <div className="container record-state-card">
            <p className="section-label">
              Record unavailable
            </p>

            <h1>
              {error
                ? "Database unavailable"
                : "Record not found"}
            </h1>

            <p>
              {error ||
                "The record you requested does not exist, is not published, has expired, or is no longer available."}
            </p>

            <Link
              to="/search"
              className="button primary-button"
            >
              Back to search
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const convictions = record.convictions || [];
  const sentences = record.sentences || [];
  const locations = record.locations || [];
  const sources = record.sources || [];

  return (
    <div className="site">
      <PageHeader />

      <main className="record-page">
        <section
          className={`record-alert ${
            record.demo ? "record-alert-demo" : ""
          }`}
        >
          <div className="container record-alert-inner">
            <div className="record-alert-icon" aria-hidden="true">
              !
            </div>

            <div>
              <strong>
                {record.demo
                  ? "Demonstration profile."
                  : "Use this information lawfully and responsibly."}
              </strong>

              <p>
                {record.demo
                  ? "The person and information shown on this page are fictional and are used only for development."
                  : "Do not use this record to threaten, harass, stalk, intimidate, shame, dox or encourage harm against any person. If you believe information is inaccurate, use the correction process."}
              </p>
            </div>

            {!record.demo && (
              <Link
                to="/privacy-responsible-use#corrections"
                className="record-alert-link"
              >
                Correction policy
              </Link>
            )}
          </div>
        </section>

        <section className="profile-section">
          <div className="container">
            <div className="profile-shell">
              <div className="profile-photo-column">
                <ProfilePhoto record={record} />

                <div className="profile-reference">
                  <span>Record reference</span>
                  <strong>{record.referenceId}</strong>
                </div>
              </div>

              <div className="profile-content">
                <div className="profile-topline">
                  <div className="profile-status">
                    <span
                      className="profile-status-dot"
                      aria-hidden="true"
                    />
                    <span>{record.status}</span>
                  </div>

                  {record.demo && (
                    <span className="profile-demo-label">
                      Demo
                    </span>
                  )}
                </div>

                <h1>
                  {record.firstName} {record.lastName}
                </h1>

                <div className="profile-location">
                  <LocationIcon />

                  <span>
                    {record.location || "Location not listed"}
                    {record.parish
                      ? `, ${record.parish}`
                      : ""}
                  </span>
                </div>

                <dl className="profile-facts">
                  <div>
                    <dt>Birth year</dt>
                    <dd>
                      {record.birthYear || "Not listed"}
                    </dd>
                  </div>

                  <div>
                    <dt>Convictions</dt>
                    <dd>{record.convictionCount ?? convictions.length}</dd>
                  </div>

                  <div>
                    <dt>Sentences</dt>
                    <dd>{record.sentenceCount ?? sentences.length}</dd>
                  </div>

                  <div>
                    <dt>Last reviewed</dt>
                    <dd>{formatDate(record.lastReviewed)}</dd>
                  </div>
                </dl>

                <div className="profile-actions">
                  <Link
                    to="/search"
                    className="record-text-action"
                  >
                    <BackIcon />
                    <span>Back to search</span>
                  </Link>

                  <a
                    href="#sources"
                    className="record-text-action"
                  >
                    <DocumentIcon />
                    <span>Sources</span>
                  </a>

                  <Link
                    to="/privacy-responsible-use#corrections"
                    className="record-text-action"
                  >
                    <span>Request correction</span>
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="record-content-section">
          <div className="container record-layout">
            <div className="record-main-column">
              <section
                className="record-section"
                aria-labelledby="convictions-heading"
              >
                <div className="record-section-heading">
                  <div>
                    <p className="record-kicker">
                      Conviction information
                    </p>

                    <h2 id="convictions-heading">
                      Convictions
                    </h2>
                  </div>

                  <span className="record-count">
                    {convictions.length}
                  </span>
                </div>

                {convictions.length ? (
                  <div className="record-entry-list">
                    {convictions.map(
                      (conviction, index) => (
                        <article
                          className="record-entry"
                          key={conviction.id}
                        >
                          <div className="record-entry-index">
                            {String(index + 1).padStart(
                              2,
                              "0",
                            )}
                          </div>

                          <div className="record-entry-body">
                            <h3>
                              {conviction.offence}
                            </h3>

                            <dl className="detail-grid">
                              <div>
                                <dt>Conviction date</dt>
                                <dd>
                                  {formatDate(
                                    conviction.convictionDate,
                                  )}
                                </dd>
                              </div>

                              <div>
                                <dt>Court</dt>
                                <dd>
                                  {conviction.court ||
                                    "Not listed"}
                                </dd>
                              </div>

                              <div>
                                <dt>Case reference</dt>
                                <dd>
                                  {conviction.caseReference ||
                                    "Not listed"}
                                </dd>
                              </div>
                            </dl>

                            {conviction.notes && (
                              <p className="record-note">
                                {conviction.notes}
                              </p>
                            )}
                          </div>
                        </article>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="record-empty-copy">
                    No conviction details are available
                    for this profile.
                  </p>
                )}
              </section>

              <section
                className="record-section"
                aria-labelledby="sentences-heading"
              >
                <div className="record-section-heading">
                  <div>
                    <p className="record-kicker">
                      Sentencing information
                    </p>

                    <h2 id="sentences-heading">
                      Sentences
                    </h2>
                  </div>

                  <span className="record-count">
                    {sentences.length}
                  </span>
                </div>

                {sentences.length ? (
                  <div className="sentence-list">
                    {sentences.map((sentence) => (
                      <article
                        className="sentence-item"
                        key={sentence.id}
                      >
                        <h3>{sentence.sentence}</h3>

                        <dl className="detail-grid detail-grid-two">
                          <div>
                            <dt>Sentence date</dt>
                            <dd>
                              {formatDate(
                                sentence.sentenceDate,
                              )}
                            </dd>
                          </div>

                          <div>
                            <dt>Court</dt>
                            <dd>
                              {sentence.court ||
                                "Not listed"}
                            </dd>
                          </div>
                        </dl>

                        {sentence.notes && (
                          <p className="record-note">
                            {sentence.notes}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="record-empty-copy">
                    No sentencing details are available
                    for this profile.
                  </p>
                )}
              </section>

              <section
                className="record-section"
                aria-labelledby="locations-heading"
              >
                <div className="record-section-heading">
                  <div>
                    <p className="record-kicker">
                      General location information
                    </p>

                    <h2 id="locations-heading">
                      Known locations
                    </h2>
                  </div>
                </div>

                {locations.length ? (
                  <div className="location-list">
                    {locations.map((location) => (
                      <article
                        className="location-row"
                        key={location.id}
                      >
                        <div className="location-symbol">
                          <LocationIcon />
                        </div>

                        <div className="location-main">
                          <h3>
                            {location.area}
                            {location.parish
                              ? `, ${location.parish}`
                              : ""}
                          </h3>

                          <p>
                            {location.type ||
                              "General location"}
                          </p>
                        </div>

                        <div className="location-reviewed">
                          <span>Last verified</span>
                          <strong>
                            {formatDate(
                              location.lastVerified,
                            )}
                          </strong>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="record-empty-copy">
                    No general location information is
                    available for this profile.
                  </p>
                )}

                <p className="location-policy">
                  Exact residential addresses should
                  not be displayed unless publication
                  is specifically authorised under the
                  applicable framework.
                </p>
              </section>

              <section
                className="record-section"
                id="sources"
                aria-labelledby="sources-heading"
              >
                <div className="record-section-heading">
                  <div>
                    <p className="record-kicker">
                      Supporting information
                    </p>

                    <h2 id="sources-heading">
                      Sources
                    </h2>
                  </div>
                </div>

                {sources.length ? (
                  <div className="source-list">
                    {sources.map((source) => (
                      <article
                        className="source-row"
                        key={source.id}
                      >
                        <div className="source-icon">
                          <DocumentIcon />
                        </div>

                        <div className="source-content">
                          <h3>{source.title}</h3>

                          <p>
                            {source.publisher ||
                              "Publisher not listed"}
                          </p>

                          <dl className="source-meta">
                            <div>
                              <dt>Published</dt>
                              <dd>
                                {formatDate(
                                  source.publishedDate,
                                )}
                              </dd>
                            </div>

                            <div>
                              <dt>Reference</dt>
                              <dd>
                                {source.reference ||
                                  "Not listed"}
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <div className="source-action">
                          {source.url ? (
                            <a
                              href={source.url}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open source
                              <ArrowIcon />
                            </a>
                          ) : (
                            <span>
                              {record.demo
                                ? "Demo source"
                                : "No link available"}
                            </span>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="record-empty-copy">
                    No source links are currently
                    available for this profile.
                  </p>
                )}
              </section>
            </div>

            <aside className="record-sidebar">
              <div className="sidebar-block">
                <p className="sidebar-label">
                  Record status
                </p>

                <div className="sidebar-status">
                  <span
                    className="profile-status-dot"
                    aria-hidden="true"
                  />

                  <strong>{record.status}</strong>
                </div>

                <p>
                  This record is currently available
                  through the public database.
                </p>
              </div>

              <div className="sidebar-block">
                <p className="sidebar-label">
                  Verification
                </p>

                <div className="sidebar-date">
                  <CalendarIcon />

                  <div>
                    <span>Last reviewed</span>
                    <strong>
                      {formatDate(record.lastReviewed)}
                    </strong>
                  </div>
                </div>

                <div className="sidebar-date">
                  <CalendarIcon />

                  <div>
                    <span>First published</span>
                    <strong>
                      {formatDate(record.publishedAt)}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="sidebar-block correction-block">
                <p className="sidebar-label">
                  See something wrong?
                </p>

                <h3>Request a correction</h3>

                <p>
                  Information that appears inaccurate,
                  outdated or incorrectly attributed
                  should be submitted for review.
                </p>

                <Link
                  to="/privacy-responsible-use#corrections"
                  className="sidebar-action"
                >
                  Request correction
                  <ArrowIcon />
                </Link>
              </div>

              <div className="sidebar-block">
                <p className="sidebar-label">
                  Record reference
                </p>

                <code>{record.referenceId}</code>
              </div>
            </aside>
          </div>
        </section>

        <section className="record-responsible">
          <div className="container">
            <div className="record-responsible-box">
              <div className="record-responsible-heading">
                <ShieldIcon />

                <div>
                  <span>Important notice</span>
                  <h2>
                    Use this information lawfully and
                    responsibly.
                  </h2>
                </div>
              </div>

              <div>
                <p>
                  Public-record information does not
                  authorise vigilantism, threats,
                  stalking, intimidation, harassment,
                  doxxing or unlawful discrimination.
                </p>

                <Link
                  to="/privacy-responsible-use"
                  className="record-responsible-link"
                >
                  Read responsible-use policy
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <img
              src="/images/rsvgpf-emblem.svg"
              alt=""
              aria-hidden="true"
            />

            <div>
              <strong>SVGSR</strong>
              <span>
                Sexual Offence Conviction Records
              </span>
            </div>
          </div>

          <nav
            className="footer-links"
            aria-label="Footer navigation"
          >
            <Link to="/">Home</Link>
            <Link to="/search">Search</Link>
            <Link to="/privacy-responsible-use">
              Responsible use
            </Link>
            <Link to="/privacy-responsible-use#corrections">
              Corrections
            </Link>
          </nav>
        </div>

        <div className="container footer-bottom">
          <p>
            Independent service — not an official
            Government of Saint Vincent and the
            Grenadines or RSVGPF website.
          </p>

          <p>© 2026 SVGSR</p>
        </div>
      </footer>
    </div>
  );
}

export default RecordDetails;
