import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router";
import "./App.css";

const parishes = [
  "All parishes",
  "Charlotte",
  "Grenadines",
  "Saint Andrew",
  "Saint David",
  "Saint George",
  "Saint Patrick",
];

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 7h16M4 12h16M4 17h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6 6l12 12M18 6 6 18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="10.5"
        cy="10.5"
        r="5.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m14.9 14.9 4.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
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

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams();

    for (const [key, value] of formData.entries()) {
      const cleanedValue = String(value).trim();

      if (cleanedValue) {
        params.set(key, cleanedValue);
      }
    }

    const queryString = params.toString();

    navigate(
      queryString
        ? `/search?${queryString}`
        : "/search",
    );
  };

  const scrollToSearch = () => {
    document
      .getElementById("search")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className="site">
      {/* HEADER */}
      <header className="header">
        <div className="header-inner">
          <button
            type="button"
            className="header-control"
            aria-label={
              menuOpen
                ? "Close menu"
                : "Open menu"
            }
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={() =>
              setMenuOpen((value) => !value)
            }
          >
            {menuOpen ? (
              <CloseIcon />
            ) : (
              <MenuIcon />
            )}
          </button>

          <Link
            className="brand"
            to="/"
            aria-label="SVGSR home"
          >
            <span className="brand-main">
              SVGSR
            </span>

            <span className="brand-sub">
              Sexual Offences Conviction Register 🇻🇨
            </span>
          </Link>

          <button
            type="button"
            className="header-control"
            aria-label="Go to record search"
            onClick={scrollToSearch}
          >
            <SearchIcon />
          </button>
        </div>

        {menuOpen && (
          <nav
            className="menu"
            id="main-menu"
            aria-label="Main navigation"
          >
            <div className="container menu-inner">
              <a
                href="#about"
                onClick={closeMenu}
              >
                About
              </a>

              <a
                href="#methodology"
                onClick={closeMenu}
              >
                Methodology
              </a>

              <Link
                to="/privacy-responsible-use#corrections"
                onClick={closeMenu}
              >
                Corrections
              </Link>

              <Link
                to="/privacy-responsible-use#responsible-use"
                onClick={closeMenu}
              >
                Safety & responsible use
              </Link>
            </div>
          </nav>
        )}

        <div
          className="national-line"
          aria-hidden="true"
        >
          <span />
          <span />
          <span />
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-logo-wrap">
              <img
                src="/images/rsvgpf-emblem.svg"
                alt="Royal Saint Vincent and the Grenadines Police Force emblem"
                className="hero-logo"
              />
            </div>

            <div className="hero-content">
              <p className="section-label">
                Public record information
              </p>

              <h1>
                Search Sexual Offences Records
              </h1>

              <p className="hero-text">
                Search published conviction information
                by name or general location across Saint
                Vincent and the Grenadines.
              </p>

              <div className="hero-actions">
                <button
                  type="button"
                  className="button primary-button"
                  onClick={scrollToSearch}
                >
                  Start a search
                </button>

                <a
                  href="#about"
                  className="button secondary-button"
                >
                  How this service works
                </a>
              </div>

              <p className="independent-note">
                Independent public-record service. Not
                an official Government or Police
                registry.
              </p>
            </div>
          </div>
        </section>

        {/* SEARCH */}
        <section
          className="search-section"
          id="search"
          aria-labelledby="search-heading"
        >
          <div className="container">
            <div className="search-box">
              <div className="search-heading">
                <h2 id="search-heading">
                  Search records
                </h2>

                <p>
                  Search published records by a
                  person's name or by a general
                  location.
                </p>
              </div>

              <div className="search-columns">
                {/* SEARCH BY NAME */}
                <form
                  className="search-form"
                  onSubmit={handleSubmit}
                >
                  <div className="form-heading">
                    <h3>
                      Search by name
                    </h3>

                    <p>
                      Enter a first name, last name,
                      or both.
                    </p>
                  </div>

                  <div className="field">
                    <label htmlFor="firstName">
                      First name
                    </label>

                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="First name"
                      autoComplete="given-name"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="lastName">
                      Last name
                    </label>

                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Last name"
                      autoComplete="family-name"
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                  >
                    <span>
                      Search by name
                    </span>

                    <ArrowIcon />
                  </button>
                </form>

                {/* SEARCH BY LOCATION */}
                <form
                  className="search-form"
                  onSubmit={handleSubmit}
                >
                  <div className="form-heading">
                    <h3>
                      Search by location
                    </h3>

                    <p>
                      Search a town, community or
                      parish.
                    </p>
                  </div>

                  <div className="field">
                    <label htmlFor="location">
                      Town or community
                    </label>

                    <input
                      id="location"
                      name="location"
                      type="text"
                      placeholder="e.g. Kingstown"
                      autoComplete="address-level2"
                    />
                  </div>

                  <div className="field">
                    <label htmlFor="parish">
                      Parish
                    </label>

                    <select
                      id="parish"
                      name="parish"
                      defaultValue=""
                    >
                      {parishes.map(
                        (parish, index) => (
                          <option
                            key={parish}
                            value={
                              index === 0
                                ? ""
                                : parish
                            }
                          >
                            {parish}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="submit-button"
                  >
                    <span>
                      Search by location
                    </span>

                    <ArrowIcon />
                  </button>
                </form>
              </div>

              <div className="search-notice">
                <span
                  className="notice-icon"
                  aria-hidden="true"
                >
                  !
                </span>

                <p>
                  Records may change when new
                  authoritative information becomes
                  available. Do not use information
                  from this service to threaten,
                  harass, stalk or intimidate another
                  person.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section
          className="about-section"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="container about-grid">
            <div>
              <p className="section-label">
                About the service
              </p>

              <h2
                className="section-title"
                id="about-title"
              >
                Public records presented clearly and
                responsibly.
              </h2>
            </div>

            <div className="about-text">
              <p className="lead">
                The Sexual Offences Conviction
                Register is an independent
                public-record service for Saint
                Vincent and the Grenadines. It is
                intended to present qualifying
                conviction information supported by
                identifiable court, police or other
                authoritative public sources.
              </p>

              <p>
                Each published profile should identify
                the source supporting the record and
                clearly present relevant conviction,
                sentencing and review information.
              </p>

    

              <a
                href="#methodology"
                className="text-link"
              >
                <span>
                  View methodology and sources
                </span>

                <ArrowIcon />
              </a>
            </div>
          </div>
        </section>

        {/* PRINCIPLES / METHODOLOGY */}
        <section
          className="principles-section"
          id="methodology"
          aria-label="Publication principles"
        >
          <div className="container principles-grid">
            <article>
              <h3>
                Verified sources
              </h3>

              <p>
                Published information are always
                supported by an identifiable court,
                police or other authoritative public
                source.
              </p>
            </article>

            <article>
              <h3>
                Regular review
              </h3>

              <p>
                We regularly conduct reviews to ensure outdated information is not left online indefinitely
              </p>
            </article>

            <article>
              <h3>
                Clear corrections
              </h3>

              <p>
                Spot something wrong? Let us know. You can report any inaccurate, outdated, or incorrectly credited information, and our team will review it right away.
              </p>
            </article>
          </div>
        </section>

        {/* RESOURCES */}
        <section
          className="resources-section"
          id="resources"
          aria-labelledby="resources-title"
        >
          <div className="container">
            <div className="resources-heading">
              <div>
                <p className="section-label">
                  Information & support
                </p>

                <h2
                  className="section-title"
                  id="resources-title"
                >
                  Guidance and resources
                </h2>
              </div>

              <p>
                Learn how records are handled and how
                this service should be used.
              </p>
            </div>

            <div className="resource-list">
              <a
                href="#methodology"
                className="resource-item"
              >
                <div>
                  <h3>
                    Methodology & sources
                  </h3>

                  <p>
                    How records are checked and which
                    sources can support a published
                    profile.
                  </p>
                </div>

                <ArrowIcon />
              </a>

              <Link
                to="/privacy-responsible-use#corrections"
                className="resource-item"
              >
                <div>
                  <h3>
                    Request a correction
                  </h3>

                  <p>
                    Report inaccurate, outdated or
                    incorrectly attributed
                    information.
                  </p>
                </div>

                <ArrowIcon />
              </Link>

              <Link
                to="/privacy-responsible-use#responsible-use"
                className="resource-item"
              >
                <div>
                  <h3>
                    Safety & responsible use
                  </h3>

                  <p>
                    Understand the rules against
                    harassment, threats, stalking,
                    intimidation and vigilantism.
                  </p>
                </div>

                <ArrowIcon />
              </Link>

              <Link
                to="/privacy-responsible-use"
                className="resource-item"
              >
                <div>
                  <h3>
                    Privacy & responsible use
                  </h3>

                  <p>
                    Understand what information may be
                    displayed, how records are
                    reviewed and how this service may
                    be used.
                  </p>
                </div>

                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        {/* RESPONSIBLE USE */}
        <section
          className="responsible-section"
          id="responsible-use"
        >
          <div className="container">
            <div className="responsible-box">
              <div>
                <p className="responsible-label">
                  Important notice
                </p>

                <h2>
                  Use Public-Record Information
                  Responsibly.
                </h2>
              </div>

              <div className="responsible-copy">
                <p>
                  This service does not authorise
                  vigilantism, harassment, threats,
                  stalking, intimidation, doxxing or
                  unlawful discrimination.
                  Information may be corrected,
                  updated or removed when
                  authoritative records change.
                </p>

                <Link
                  to="/privacy-responsible-use"
                  className="responsible-more-link"
                >
                  <span>
                    Read privacy & responsible-use
                    policy
                  </span>

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
                SVGSR
              </strong>

              <span>
                Sexual Offences Conviction Register
              </span>
            </div>
          </div>

          <nav
            className="footer-links"
            aria-label="Footer navigation"
          >
            <a href="#about">
              About
            </a>

            <a href="#methodology">
              Methodology
            </a>

            <Link to="/privacy-responsible-use#corrections">
              Corrections
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
            © 2026 SVGSR
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
