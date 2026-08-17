const makeRecord = ({ id, slug, firstName, lastName, birthYear, location, parish, convictions = 1, reviewed, published, year, ref }) => ({
  id,
  slug,
  firstName,
  lastName,
  birthYear,
  location,
  parish,
  status: "Published",
  referenceId: ref,
  publishedAt: published,
  lastReviewed: reviewed,
  photoUrl: null,
  convictionCount: convictions,
  sentenceCount: 1,
  demo: true,
  convictions: Array.from({ length: convictions }, (_, i) => ({
    id: `${id}-conviction-${i + 1}`,
    offence: i === 0 ? "Demonstration sexual offence conviction" : `Additional demonstration conviction ${i + 1}`,
    court: "Demo Court Record",
    convictionDate: `${year}-05-14`,
    caseReference: `DEMO-CR-${year}-${String(i + 1).padStart(3, "0")}`,
    notes: "Fictional information used only to demonstrate the record interface.",
  })),
  sentences: [
    {
      id: `${id}-sentence-1`,
      sentence: "Demonstration custodial sentence",
      sentenceDate: `${year}-06-03`,
      court: "Demo Court Record",
      notes: "Fictional sentencing information for interface testing only.",
    },
  ],
  locations: [
    {
      id: `${id}-location-1`,
      area: location,
      parish,
      type: "General location",
      lastVerified: reviewed,
    },
  ],
  sources: [
    {
      id: `${id}-source-1`,
      title: "Demonstration court record",
      publisher: "Development test source",
      publishedDate: `${year}-05-14`,
      reference: `DEMO-CR-${year}-001`,
      url: null,
    },
  ],
});

const sampleRecords = [
  makeRecord({ id: "demo-001", slug: "demo-jordan-hart", firstName: "Jordan", lastName: "Hart", birthYear: 1990, location: "Kingstown", parish: "Saint George", convictions: 1, reviewed: "2026-08-12", published: "2026-08-01", year: 2024, ref: "SVGOR-DEMO-0001" }),
  makeRecord({ id: "demo-002", slug: "demo-alex-sample", firstName: "Alex", lastName: "Sample", birthYear: 1984, location: "Georgetown", parish: "Charlotte", convictions: 2, reviewed: "2026-08-10", published: "2026-08-02", year: 2023, ref: "SVGOR-DEMO-0002" }),
  makeRecord({ id: "demo-003", slug: "demo-morgan-test", firstName: "Morgan", lastName: "Test", birthYear: 1978, location: "Barrouallie", parish: "Saint Patrick", convictions: 1, reviewed: "2026-08-08", published: "2026-08-03", year: 2022, ref: "SVGOR-DEMO-0003" }),
  makeRecord({ id: "demo-004", slug: "demo-cameron-record", firstName: "Cameron", lastName: "Record", birthYear: 1988, location: "Calliaqua", parish: "Saint George", convictions: 1, reviewed: "2026-08-07", published: "2026-08-04", year: 2024, ref: "SVGOR-DEMO-0004" }),
  makeRecord({ id: "demo-005", slug: "demo-riley-public", firstName: "Riley", lastName: "Public", birthYear: 1981, location: "Chateaubelair", parish: "Saint David", convictions: 3, reviewed: "2026-08-04", published: "2026-08-05", year: 2021, ref: "SVGOR-DEMO-0005" }),
  makeRecord({ id: "demo-006", slug: "demo-taylor-example", firstName: "Taylor", lastName: "Example", birthYear: 1993, location: "Bequia", parish: "Grenadines", convictions: 1, reviewed: "2026-08-01", published: "2026-08-06", year: 2025, ref: "SVGOR-DEMO-0006" }),
];

export default sampleRecords;
