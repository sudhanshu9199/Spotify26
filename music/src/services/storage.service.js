import { createClient } from "@supabase/supabase-js";
import config from "../config/config.js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SECRET_KEY);

export async function uploadFile(file) {
  const key = `${uuidv4()}-${file.originalname.replace(/\s+/g, "-")}`;
  const { data, error } = await supabase.storage
    .from(config.SUPABASE_BUCKET_NAME)
    .upload(key, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (error) {
    console.error("Supabase Upload Error:", error.message);
    throw new Error("Failed to upload file");
  }

  return key;
}

export async function getPresignedUrl(key) {
  const { data, error } = await supabase.storage
    .from(config.SUPABASE_BUCKET_NAME)
    .createSignedUrl(key, 3600);

  if (error) {
    console.error("Supabase Signed URL Error:", error.message);
    throw new Error("Failed to get signed URL");
  }

  return data.signedUrl;
}
