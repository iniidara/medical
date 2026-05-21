const SUPABASE_URL =
  "https://uwemkgjbchcahckrcqku.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_fBCoBIknlbJWLzayVqT_2w_zaTjEBEN";

const supabaseClient =
  supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );