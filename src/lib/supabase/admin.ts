import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getOptionalEnv, hasSupabaseAdminConfig } from "@/lib/env";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdmin() {
  if (!hasSupabaseAdminConfig()) {
    return null;
  }

  if (!adminClient) {
    adminClient = createClient(
      getOptionalEnv("NEXT_PUBLIC_SUPABASE_URL")!,
      getOptionalEnv("SUPABASE_SERVICE_ROLE_KEY")!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
  }

  return adminClient;
}
