import { supabase } from "@/lib/supabase/client";

export async function uploadImageToStorage(file: File, folder = "uploads") {
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "images";
  const ext = file.name.split(".").pop();
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filename, file, {
      cacheControl: "3600",
      upsert: false,
    });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
}
