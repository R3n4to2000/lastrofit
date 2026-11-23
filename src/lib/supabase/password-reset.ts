import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./config";

export function createPasswordResetClient() {
  const config = getSupabaseConfig();
  if (!config) return null;

  // The hosted default email uses ConfirmationURL. An implicit recovery link
  // works even when the email opens in a different browser from the request.
  return createClient(config.url, config.publishableKey, {
    auth: {
      flowType: "implicit",
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
