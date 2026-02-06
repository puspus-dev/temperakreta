import { createClient } from "@supabase/supabase-js";

// IDE ÍRD BE A SAJÁT tempera-api adataidat
const SUPABASE_URL = "https://hjuwmgukpcgoqyiaptlo.supabase.co";       // a tempera-api URL-ed
const SUPABASE_ANON_KEY = "sb_publishable_g-L8nE_Gvlu0QiWBIHHsAQ_asrUVGli";      // a tempera-api anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
