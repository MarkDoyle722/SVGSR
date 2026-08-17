import { supabase } from "../lib/supabase";

function toPublicPhotoUrl(photoPath) {
  if (!photoPath) return null;

  const { data } = supabase.storage
    .from("offender-photos")
    .getPublicUrl(photoPath);

  return data?.publicUrl || null;
}

function mapListRecord(row) {
  return {
    id: row.id,
    slug: row.slug,
    firstName: row.first_name,
    lastName: row.last_name,
    birthYear: row.birth_year,
    location: row.primary_location || "Location not listed",
    parish: row.parish || "",
    convictionCount: row.convictions?.[0]?.count ?? 0,
    status: row.status === "published" ? "Published" : row.status,
    lastReviewed: row.last_reviewed_at,
    photoUrl: toPublicPhotoUrl(row.photo_path),
    demo: row.reference_id?.startsWith("SVGOR-DEMO-") ?? false,
  };
}

function mapRecordDetails(row) {
  return {
    id: row.id,
    slug: row.slug,
    firstName: row.first_name,
    lastName: row.last_name,
    birthYear: row.birth_year,
    location: row.primary_location || "Location not listed",
    parish: row.parish || "",
    status: row.status === "published" ? "Published" : row.status,
    referenceId: row.reference_id,
    publishedAt: row.published_at,
    lastReviewed: row.last_reviewed_at,
    photoUrl: toPublicPhotoUrl(row.photo_path),
    convictionCount: row.convictions?.length ?? 0,
    sentenceCount: row.sentences?.length ?? 0,
    demo: row.reference_id?.startsWith("SVGOR-DEMO-") ?? false,
    convictions: (row.convictions || [])
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((item) => ({
        id: item.id,
        offence: item.offence,
        court: item.court,
        convictionDate: item.conviction_date,
        caseReference: item.case_reference,
        notes: item.notes,
      })),
    sentences: (row.sentences || [])
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((item) => ({
        id: item.id,
        sentence: item.sentence,
        sentenceDate: item.sentence_date,
        court: item.court,
        notes: item.notes,
      })),
    locations: (row.offender_locations || [])
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((item) => ({
        id: item.id,
        area: item.area,
        parish: item.parish,
        type: item.location_type,
        lastVerified: item.last_verified,
      })),
    sources: (row.sources || [])
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((item) => ({
        id: item.id,
        title: item.title,
        publisher: item.publisher,
        publishedDate: item.published_date,
        reference: item.source_reference,
        url: item.url,
      })),
  };
}

export async function searchRecords({
  firstName = "",
  lastName = "",
  location = "",
  parish = "",
} = {}) {
  let query = supabase
    .from("offenders")
    .select(`
      id,
      slug,
      first_name,
      last_name,
      birth_year,
      primary_location,
      parish,
      photo_path,
      status,
      reference_id,
      last_reviewed_at,
      convictions(count)
    `)
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true })
    .limit(100);

  if (firstName.trim()) {
    query = query.ilike("first_name", `%${firstName.trim()}%`);
  }

  if (lastName.trim()) {
    query = query.ilike("last_name", `%${lastName.trim()}%`);
  }

  if (location.trim()) {
    query = query.ilike("primary_location", `%${location.trim()}%`);
  }

  if (parish.trim()) {
    query = query.eq("parish", parish.trim());
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map(mapListRecord);
}

export async function getRecordBySlug(slug) {
  const { data, error } = await supabase
    .from("offenders")
    .select(`
      id,
      slug,
      first_name,
      last_name,
      birth_year,
      primary_location,
      parish,
      photo_path,
      status,
      reference_id,
      published_at,
      last_reviewed_at,
      convictions (
        id,
        offence,
        court,
        conviction_date,
        case_reference,
        notes,
        display_order
      ),
      sentences (
        id,
        sentence,
        sentence_date,
        court,
        notes,
        display_order
      ),
      offender_locations (
        id,
        area,
        parish,
        location_type,
        last_verified,
        display_order
      ),
      sources (
        id,
        title,
        publisher,
        published_date,
        source_reference,
        url,
        display_order
      )
    `)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return mapRecordDetails(data);
}
