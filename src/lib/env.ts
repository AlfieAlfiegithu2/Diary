export function getOptionalEnv(name: string) {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : null;
}

export function hasSupabaseConfig() {
  return Boolean(getOptionalEnv("NEXT_PUBLIC_SUPABASE_URL") && getOptionalEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"));
}

export function hasSupabaseAdminConfig() {
  return Boolean(getOptionalEnv("SUPABASE_SERVICE_ROLE_KEY") && getOptionalEnv("NEXT_PUBLIC_SUPABASE_URL"));
}

export function hasR2Config() {
  return Boolean(
    getOptionalEnv("R2_ACCOUNT_ID") &&
      getOptionalEnv("R2_ACCESS_KEY_ID") &&
      getOptionalEnv("R2_SECRET_ACCESS_KEY") &&
      getOptionalEnv("R2_BUCKET"),
  );
}
