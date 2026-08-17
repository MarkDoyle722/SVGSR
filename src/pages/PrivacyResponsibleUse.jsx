import { Link } from "react-router";

import "../App.css";
import "./PrivacyResponsibleUse.css";

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

function PrivacyResponsibleUse() {
  return (
    <div className="site">
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <Link
            to="/"
            className="header-control"
            aria-label="Back to homepage"
          >
            <BackIcon />
          </Link>

          <Link
            className="brand"
            to="/"
            aria-label="SVGOR homepage"
          >
            <span className="brand-main">
              SVGSR
            </span>

            <span className="brand-sub">
              Sexual Offence Conviction Register
            </span>
          </Link>

          <div className="header-control-spacer" />
        </div>

        <div
          className="national-line"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>
      </header>

      <main className="policy-page">
        {/* HERO */}
        <section className="policy-hero">
          <div className="container">
            <p className="section-label">
              Privacy & responsible use
            </p>

            <h1>
              Use record information lawfully,
              carefully and responsibly.
            </h1>

            <p className="policy-intro">
              SVGSR is intended to make qualifying
              public-record information easier to
              understand. Publication of information
              on this service does not give anyone
              permission to threaten, harass, stalk,
              intimidate or target another person.
            </p>
          </div>
        </section>

        {/* IMPORTANT WARNING */}
        <section className="policy-warning-section">
          <div className="container">
            <div className="policy-warning">
              <div className="policy-warning-mark">
                !
              </div>

              <div>
                <strong>
                  Important safety notice
                </strong>

                <p>
                  Do not use information obtained
                  through SVGSR to harass, threaten,
                  intimidate, stalk, shame, dox,
                  confront or encourage violence
                  against another person.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="policy-content-section">
          <div className="container policy-layout">
            <aside className="policy-navigation">
              <span>
                On this page
              </span>

              <a href="#purpose">
                Purpose of the service
              </a>

              <a href="#information">
                Information we publish
              </a>

              <a href="#responsible-use">
                Responsible use
              </a>

              <a href="#prohibited">
                Prohibited behaviour
              </a>

              <a href="#privacy">
                Privacy
              </a>

              <a href="#accuracy">
                Accuracy and review
              </a>

              <a href="#corrections">
                Corrections
              </a>

              <a href="#retention">
                Record review periods
              </a>
            </aside>

            <div className="policy-main">
              {/* PURPOSE */}
              <section
                className="policy-section"
                id="purpose"
              >
                <p className="policy-kicker">
                  01
                </p>

                <h2>
                  Purpose of the service
                </h2>

                <p>
                  SVGSR is designed to present
                  qualifying sexual offence conviction
                  information in a clear and
                  structured format.
                </p>

                <p>
                  The service is intended for lawful
                  public-information and safeguarding
                  purposes. It is not intended to
                  encourage punishment outside the
                  justice system, confrontation or
                  vigilantism.
                </p>
              </section>

              {/* INFORMATION */}
              <section
                className="policy-section"
                id="information"
              >
                <p className="policy-kicker">
                  02
                </p>

                <h2>
                  Information we publish
                </h2>

                <p>
                  A published record may contain
                  identifying information necessary to
                  distinguish the person connected to
                  the qualifying conviction.
                </p>

                <div className="policy-data-grid">
                  <div>
                    <strong>
                      Identity
                    </strong>

                    <span>
                      Name, birth year and photograph
                      where publication is appropriate.
                    </span>
                  </div>

                  <div>
                    <strong>
                      General location
                    </strong>

                    <span>
                      Town, community or parish rather
                      than an exact residential
                      address.
                    </span>
                  </div>

                  <div>
                    <strong>
                      Conviction information
                    </strong>

                    <span>
                      Qualifying offence, conviction
                      date, court and case reference
                      where available.
                    </span>
                  </div>

                  <div>
                    <strong>
                      Sentencing information
                    </strong>

                    <span>
                      Relevant sentence information
                      supported by an authoritative
                      source.
                    </span>
                  </div>

                  <div>
                    <strong>
                      Sources
                    </strong>

                    <span>
                      References identifying the
                      source used to support the
                      record.
                    </span>
                  </div>

                  <div>
                    <strong>
                      Review information
                    </strong>

                    <span>
                      Publication and verification
                      dates used to manage record
                      review.
                    </span>
                  </div>
                </div>
              </section>

              {/* RESPONSIBLE USE */}
              <section
                className="policy-section"
                id="responsible-use"
              >
                <p className="policy-kicker">
                  03
                </p>

                <h2>
                  Responsible use
                </h2>

                <p>
                  Information from this service should
                  only be used for legitimate and
                  lawful purposes.
                </p>

                <p>
                  A record being publicly accessible
                  does not remove the rights, safety
                  or dignity of the person identified
                  in that record.
                </p>
              </section>

              {/* PROHIBITED */}
              <section
                className="policy-section"
                id="prohibited"
              >
                <p className="policy-kicker">
                  04
                </p>

                <h2>
                  What you must not do
                </h2>

                <div className="prohibited-box">
                  <p>
                    Information from SVGSR must not be
                    used to:
                  </p>

                  <ul>
                    <li>
                      threaten or intimidate another
                      person;
                    </li>

                    <li>
                      harass or repeatedly contact a
                      person;
                    </li>

                    <li>
                      stalk or monitor a person's
                      movements;
                    </li>

                    <li>
                      publish a private home address
                      or other unnecessary personal
                      information;
                    </li>

                    <li>
                      organise or encourage
                      vigilantism;
                    </li>

                    <li>
                      encourage violence or physical
                      confrontation;
                    </li>

                    <li>
                      impersonate SVGSR, the police,
                      the Government or another
                      authority;
                    </li>

                    <li>
                      deliberately alter a record to
                      misrepresent what the source
                      states.
                    </li>
                  </ul>
                </div>
              </section>

              {/* PRIVACY */}
              <section
                className="policy-section"
                id="privacy"
              >
                <p className="policy-kicker">
                  05
                </p>

                <h2>
                  Privacy
                </h2>

                <p>
                  SVGSR collects and display
                  only information reasonably
                  necessary for the operation of the
                  service and the identification of a
                  qualifying record.
                </p>

                <p>
                  Exact residential addresses,
                  unnecessary family information,
                  private telephone numbers, private
                  email addresses, identification
                  numbers and unrelated sensitive
                  personal information are not
                  displayed merely because they can
                  be obtained.
                </p>

    
              </section>

              {/* ACCURACY */}
              <section
                className="policy-section"
                id="accuracy"
              >
                <p className="policy-kicker">
                  06
                </p>

                <h2>
                  Accuracy and verification
                </h2>

                <p>
                  Our content relies on trustworthy, authoritative sources. We never present rumors, allegations, or unverified social media posts as verified facts.To keep our information reliable, we regularly review our records. This ensures that outdated, incorrect, overturned, or misattributed details are updated and never left online without verification
                </p>

              </section>

              {/* CORRECTIONS */}
              <section
                className="policy-section"
                id="corrections"
              >
                <p className="policy-kicker">
                  07
                </p>

                <h2>
                  Corrections
                </h2>

                <p>
                  If you believe a record contains
                  incorrect, outdated or
                  misattributed information, use the
                  correction process instead of
                  confronting the person identified
                  in the record.
                </p>

                <p>
                  Correction submissions should
                  identify the record concerned,
                  explain what information is disputed
                  and provide supporting information
                  where possible.
                </p>

                <button
                  type="button"
                  className="policy-action-button"
                >
                  Request a correction
                  <ArrowIcon />
                </button>
              </section>

              {/* RETENTION */}
              <section
                className="policy-section"
                id="retention"
              >
                <p className="policy-kicker">
                  08
                </p>

                <h2>
                  Publication and review periods
                </h2>

    

                <p>
                  To maintain total accuracy, SVGSR gives every published record a review date. When a record's review period ends, we may remove it from public search results until we can double-check the information.
                </p>

                <div className="review-flow">
                  <div>
                    <strong>
                      Published
                    </strong>

                    <span>
                      Record is available publicly.
                    </span>
                  </div>

                  <span className="review-arrow">
                    →
                  </span>

                  <div>
                    <strong>
                      Review due
                    </strong>

                    <span>
                      Publication period expires.
                    </span>
                  </div>

                  <span className="review-arrow">
                    →
                  </span>

                  <div>
                    <strong>
                      Verify
                    </strong>

                    <span>
                      Sources and details are checked.
                    </span>
                  </div>

                  <span className="review-arrow">
                    →
                  </span>

                  <div>
                    <strong>
                      Renew or remove
                    </strong>

                    <span>
                      Record is republished or
                      withdrawn.
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>

        {/* FINAL WARNING */}
        <section className="policy-final-section">
          <div className="container">
            <div className="policy-final-box">
              <div>
                <p>
                  Responsible use
                </p>

                <h2>
                  A public record is not permission
                  to take the law into your own
                  hands.
                </h2>
              </div>

              <div>
                <p>
                  If you are concerned about an
                  immediate risk or possible criminal
                  conduct, contact the appropriate
                  authorities rather than confronting
                  someone yourself.
                </p>

                <Link
                  to="/"
                  className="policy-home-link"
                >
                  Return to SVGOR
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-main">
          <div className="footer-brand">
            <img
              src="/images/rsvgpf-emblem.svg"
              alt=""
              aria-hidden="true"
            />

            <div>
              <strong>
                SVGOR
              </strong>

              <span>
                Sexual Offence Conviction Records
              </span>
            </div>
          </div>

          <nav
            className="footer-links"
            aria-label="Footer navigation"
          >
            <Link to="/">
              Home
            </Link>

            <Link to="/search">
              Search
            </Link>

            <Link to="/privacy-responsible-use">
              Privacy
            </Link>
          </nav>
        </div>

        <div className="container footer-bottom">
          <p>
            Independent service — not an official
            Government of Saint Vincent and the
            Grenadines website.
          </p>

          <p>
            © 2026 SVGOR
          </p>
        </div>
      </footer>
    </div>
  );
}

export default PrivacyResponsibleUse;