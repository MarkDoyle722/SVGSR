import { supabase } from "../lib/supabase";

function publicPhotoUrl(path) {
  if (!path) return null;

  const { data } = supabase.storage
    .from("offender-photos")
    .getPublicUrl(path);

  return data?.publicUrl || null;
}

function mapAdminRecord(row) {
  return {
    id: row.id,
    slug: row.slug,
    firstName: row.first_name,
    lastName: row.last_name,
    birthYear: row.birth_year ?? "",
    primaryLocation: row.primary_location ?? "",
    parish: row.parish ?? "",
    photoPath: row.photo_path ?? "",
    photoUrl: publicPhotoUrl(row.photo_path),
    status: row.status,
    referenceId: row.reference_id,
    publicFrom: row.public_from ?? "",
    publicUntil: row.public_until ?? "",
    publishedAt: row.published_at,
    lastReviewedAt: row.last_reviewed_at ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    convictions: (row.convictions || [])
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((item) => ({
        offence: item.offence ?? "",
        court: item.court ?? "",
        convictionDate: item.conviction_date ?? "",
        caseReference: item.case_reference ?? "",
        notes: item.notes ?? "",
      })),
    sentences: (row.sentences || [])
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((item) => ({
        sentence: item.sentence ?? "",
        sentenceDate: item.sentence_date ?? "",
        court: item.court ?? "",
        notes: item.notes ?? "",
      })),
    locations: (row.offender_locations || [])
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((item) => ({
        area: item.area ?? "",
        parish: item.parish ?? "",
        locationType: item.location_type ?? "General location",
        lastVerified: item.last_verified ?? "",
      })),
    sources: (row.sources || [])
      .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
      .map((item) => ({
        title: item.title ?? "",
        publisher: item.publisher ?? "",
        publishedDate: item.published_date ?? "",
        sourceReference: item.source_reference ?? "",
        url: item.url ?? "",
      })),
  };
}

export async function getAdminStats() {
  const [recordsResult, correctionsResult, recentResult] = await Promise.all([
    supabase
      .from("offenders")
      .select("id, status"),
    supabase
      .from("correction_requests")
      .select("id, status"),
    supabase
      .from("offenders")
      .select(`
        id,
        slug,
        first_name,
        last_name,
        status,
        reference_id,
        updated_at
      `)
      .order("updated_at", { ascending: false })
      .limit(6),
  ]);

  if (recordsResult.error) throw recordsResult.error;
  if (correctionsResult.error) throw correctionsResult.error;
  if (recentResult.error) throw recentResult.error;

  const records = recordsResult.data || [];
  const corrections = correctionsResult.data || [];

  return {
    total: records.length,
    published: records.filter((item) => item.status === "published").length,
    draft: records.filter((item) => item.status === "draft").length,
    review: records.filter((item) => item.status === "review").length,
    corrections: corrections.filter((item) => item.status === "new").length,
    recent: recentResult.data || [],
  };
}

export async function listAdminRecords() {
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
      status,
      reference_id,
      public_from,
      public_until,
      last_reviewed_at,
      updated_at,
      convictions(count),
      sentences(count)
    `)
    .order("updated_at", { ascending: false })
    .limit(500);

  if (error) throw error;

  return data || [];
}

export async function getAdminRecord(id) {
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
      public_from,
      public_until,
      published_at,
      last_reviewed_at,
      created_at,
      updated_at,
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
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  return mapAdminRecord(data);
}

export async function saveAdminRecord(form) {
  const payload = {
    id: form.id || null,
    slug: form.slug.trim(),
    first_name: form.firstName.trim(),
    last_name: form.lastName.trim(),
    birth_year: String(form.birthYear || "").trim(),
    primary_location: form.primaryLocation.trim(),
    parish: form.parish.trim(),
    photo_path: form.photoPath || "",
    status: form.status,
    reference_id: form.referenceId.trim(),
    public_from: form.publicFrom || "",
    public_until: form.publicUntil || "",
    last_reviewed_at: form.lastReviewedAt || "",
    convictions: form.convictions
      .filter((item) => item.offence.trim())
      .map((item, index) => ({
        offence: item.offence.trim(),
        court: item.court.trim(),
        conviction_date: item.convictionDate || "",
        case_reference: item.caseReference.trim(),
        notes: item.notes.trim(),
        display_order: index,
      })),
    sentences: form.sentences
      .filter((item) => item.sentence.trim())
      .map((item, index) => ({
        sentence: item.sentence.trim(),
        sentence_date: item.sentenceDate || "",
        court: item.court.trim(),
        notes: item.notes.trim(),
        display_order: index,
      })),
    locations: form.locations
      .filter((item) => item.area.trim())
      .map((item, index) => ({
        area: item.area.trim(),
        parish: item.parish.trim(),
        location_type: item.locationType.trim() || "General location",
        last_verified: item.lastVerified || "",
        display_order: index,
      })),
    sources: form.sources
      .filter((item) => item.title.trim())
      .map((item, index) => ({
        title: item.title.trim(),
        publisher: item.publisher.trim(),
        published_date: item.publishedDate || "",
        source_reference: item.sourceReference.trim(),
        url: item.url.trim(),
        display_order: index,
      })),
  };

  const { data, error } = await supabase.rpc("admin_upsert_record", {
    payload,
  });

  if (error) throw error;

  return data;
}

export async function deleteAdminRecord(id) {
  const { error } = await supabase.rpc("admin_delete_record", {
    record_id: id,
  });

  if (error) throw error;
}

export async function uploadOffenderPhoto(file, oldPath = "") {
  if (!file) return oldPath || "";

  const allowed = ["image/jpeg", "image/png", "image/webp"];

  if (!allowed.includes(file.type)) {
    throw new Error("Photo must be JPG, PNG, or WebP.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Photo must be 5 MB or smaller.");
  }

  const extension =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";

  const path = `records/${crypto.randomUUID()}.${extension}`;

  const { error } = await supabase.storage
    .from("offender-photos")
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) throw error;

  if (oldPath) {
    await supabase.storage
      .from("offender-photos")
      .remove([oldPath]);
  }

  return path;
}

export function getPhotoUrl(path) {
  return publicPhotoUrl(path);
}
