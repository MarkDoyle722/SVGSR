import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { getRecordBySlug } from "../services/records";

import "../App.css";
import "./RecordDetails.css";

function BackIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M10 7l-5 5 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ArrowIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13M14 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function LocationIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s6-5.4 6-11a6 6 0 1 0-12 0c0 5.6 6 11 6 11Z" fill="none" stroke="currentColor" strokeWidth="1.6" /><circle cx="12" cy="10" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>;
}
function DocumentIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l4 4v14H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M14 3v5h5M9 12h6M9 16h6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}
function CalendarIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3v3M18 3v3M4 9h16M5 5h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}

function formatDate(value) {
  if (!value) return "Not recorded";
  const raw = String(value).slice(0, 10);
  const date = new Date(`${raw}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

function PageHeader() {
  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/search" className="header-control" aria-label="Back to search results"><BackIcon /></Link>
        <Link className="brand" to="/" aria-label="SVGOR home"><span className="brand-main">SVGOR</span><span className="brand-sub">Sexual Offence Conviction Records</span></Link>
        <div />
      </div>
      <div className="national-line" aria-hidden="true"><span /><span /><span /></div>
    </header>
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
        if (!cancelled) setRecord(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setError("We could not load this record from the database.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return <div className="site"><PageHeader /><main className="record-not-found"><div className="container"><p className="section-label">Record profile</p><h1>Loading record</h1><p>Retrieving the published profile…</p></div></main></div>;
  }

  if (error || !record) {
    return <div className="site"><PageHeader /><main className="record-not-found"><div className="container"><p className="section-label">Record unavailable</p><h1>{error ? "Database unavailable" : "Record not found"}</h1><p>{error || "The record you requested does not exist, is not published, has expired, or is no longer available."}</p><Link to="/search" className="button primary-button">Back to search</Link></div></main></div>;
  }

  return (
    <div className="site">
      <PageHeader />
      <main className="record-page">
        {record.demo && (
          <section className="record-demo-notice"><div className="container record-demo-inner"><div className="record-demo-icon" aria-hidden="true">!</div><p><strong>Demonstration profile.</strong> The person and all information shown on this page are fictional and exist only for interface development.</p></div></section>
        )}

        <section className="profile-section">
          <div className="container"><div className="profile-shell">
            <div className="profile-photo-column">
              {record.photoUrl ? <img className="profile-photo" src={record.photoUrl} alt={`${record.firstName} ${record.lastName}`} /> : <div className="profile-photo-placeholder" aria-label="No profile photograph available"><svg viewBox="0 0 120 140" aria-hidden="true"><circle cx="60" cy="45" r="25" fill="currentColor" opacity="0.28" /><path d="M20 128c3-31 19-49 40-49s37 18 40 49" fill="currentColor" opacity="0.28" /></svg><span>No photograph available</span></div>}
              <div className="profile-reference"><span>Record reference</span><strong>{record.referenceId}</strong></div>
            </div>

            <div className="profile-content">
              <div className="profile-topline"><div className="profile-status"><span className="profile-status-dot" aria-hidden="true" /><span>{record.status}</span></div>{record.demo && <span className="profile-demo-label">Record</span>}</div>
              <h1>{record.firstName} {record.lastName}</h1>
              <div className="profile-location"><LocationIcon /><span>{record.location}{record.parish ? `, ${record.parish}` : ""}</span></div>
              <dl className="profile-facts"><div><dt>Birth year</dt><dd>{record.birthYear || "Not listed"}</dd></div><div><dt>Convictions</dt><dd>{record.convictionCount}</dd></div><div><dt>Sentences</dt><dd>{record.sentenceCount}</dd></div><div><dt>Last reviewed</dt><dd>{formatDate(record.lastReviewed)}</dd></div></dl>
              <div className="profile-actions"><a href="#sources" className="record-primary-action"><DocumentIcon /><span>View sources</span></a><a href="#correction" className="record-secondary-action">Request a correction</a></div>
            </div>
          </div></div>
        </section>

        <section className="record-content-section">
          <div className="container record-layout">
            <div className="record-main-column">
              <section className="record-section" aria-labelledby="convictions-heading">
                <div className="record-section-heading"><div><p className="record-kicker">Conviction information</p><h2 id="convictions-heading">Convictions</h2></div><span className="record-count">{record.convictions.length}</span></div>
                <div className="conviction-list">{record.convictions.map((conviction, index) => <article className="conviction-item" key={conviction.id}><div className="conviction-number">{String(index + 1).padStart(2, "0")}</div><div className="conviction-body"><h3>{conviction.offence}</h3><dl className="detail-grid"><div><dt>Conviction date</dt><dd>{formatDate(conviction.convictionDate)}</dd></div><div><dt>Court</dt><dd>{conviction.court || "Not listed"}</dd></div><div><dt>Case reference</dt><dd>{conviction.caseReference || "Not listed"}</dd></div></dl>{conviction.notes && <p className="record-note">{conviction.notes}</p>}</div></article>)}</div>
              </section>

              <section className="record-section" aria-labelledby="sentences-heading">
                <div className="record-section-heading"><div><p className="record-kicker">Sentencing information</p><h2 id="sentences-heading">Sentences</h2></div><span className="record-count">{record.sentences.length}</span></div>
                <div className="sentence-list">{record.sentences.map((sentence) => <article className="sentence-item" key={sentence.id}><h3>{sentence.sentence}</h3><dl className="detail-grid"><div><dt>Sentence date</dt><dd>{formatDate(sentence.sentenceDate)}</dd></div><div><dt>Court</dt><dd>{sentence.court || "Not listed"}</dd></div></dl>{sentence.notes && <p className="record-note">{sentence.notes}</p>}</article>)}</div>
              </section>

              <section className="record-section" aria-labelledby="locations-heading">
                <div className="record-section-heading"><div><p className="record-kicker">General location information</p><h2 id="locations-heading">Known locations</h2></div></div>
                <div className="location-list">{record.locations.map((location) => <article className="location-row" key={location.id}><div className="location-symbol"><LocationIcon /></div><div><h3>{location.area}{location.parish ? `, ${location.parish}` : ""}</h3><p>{location.type}</p></div><div className="location-reviewed"><span>Last verified</span><strong>{formatDate(location.lastVerified)}</strong></div></article>)}</div>
                <div className="location-policy">Exact residential addresses should not be displayed unless publication is specifically authorised under the applicable framework.</div>
              </section>

              <section className="record-section" id="sources" aria-labelledby="sources-heading">
                <div className="record-section-heading"><div><p className="record-kicker">Supporting information</p><h2 id="sources-heading">Sources</h2></div></div>
                <div className="source-list">{record.sources.map((source) => <article className="source-row" key={source.id}><div className="source-icon"><DocumentIcon /></div><div className="source-content"><h3>{source.title}</h3><p>{source.publisher || "Publisher not listed"}</p><dl className="source-meta"><div><dt>Published</dt><dd>{formatDate(source.publishedDate)}</dd></div><div><dt>Reference</dt><dd>{source.reference || "Not listed"}</dd></div></dl></div><div className="source-action">{source.url ? <a href={source.url} target="_blank" rel="noreferrer">Open source<ArrowIcon /></a> : <span>{record.demo ? "Demo source" : "No link available"}</span>}</div></article>)}</div>
              </section>
            </div>

            <aside className="record-sidebar">
              <div className="sidebar-block"><p className="sidebar-label">Record status</p><div className="sidebar-status"><span className="profile-status-dot" aria-hidden="true" /><strong>{record.status}</strong></div><p>This record is currently available through the public database.</p></div>
              <div className="sidebar-block"><p className="sidebar-label">Verification</p><div className="sidebar-date"><CalendarIcon /><div><span>Last reviewed</span><strong>{formatDate(record.lastReviewed)}</strong></div></div><div className="sidebar-date"><CalendarIcon /><div><span>First published</span><strong>{formatDate(record.publishedAt)}</strong></div></div></div>
              <div className="sidebar-block correction-block" id="correction"><p className="sidebar-label">See something wrong?</p><h3>Request a correction</h3><p>Information that appears inaccurate, outdated or incorrectly attributed should be submitted for review.</p><button type="button" disabled title="Correction submission will be connected in the admin/forms step.">Request correction</button></div>
              <div className="sidebar-block"><p className="sidebar-label">Record reference</p><code>{record.referenceId}</code></div>
            </aside>
          </div>
        </section>

        <section className="record-responsible"><div className="container"><div className="record-responsible-box"><div><span>Important notice</span><h2>Do not use this information to threaten or harass.</h2></div><p>Public-record information does not authorise vigilantism, threats, stalking, intimidation, harassment or unlawful discrimination. Records may also be corrected, updated or removed when authoritative information changes.</p></div></div></section>
      </main>

      <footer className="footer"><div className="container footer-main"><div className="footer-brand"><img src="/images/rsvgpf-emblem.svg" alt="" aria-hidden="true" /><div><strong>SVGOR</strong><span>Sexual Offence Conviction Records</span></div></div><nav className="footer-links" aria-label="Footer navigation"><Link to="/">Home</Link><Link to="/search">Search</Link><Link to="/">Methodology</Link><Link to="/">Corrections</Link></nav></div><div className="container footer-bottom"><p>Independent service — not an official Government of Saint Vincent and the Grenadines or RSVGPF website.</p><p>© 2026 SVGOR</p></div></footer>
    </div>
  );
}

export default RecordDetails;
