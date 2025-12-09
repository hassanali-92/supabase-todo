import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gjgafiijhmpyltbmdanw.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqZ2FmaWlqaG1weWx0Ym1kYW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxODk2NTEsImV4cCI6MjA4MDc2NTY1MX0.QKbmSKLekHZhBlTQWSpuxUYUWWzOZv97tkImpXSNsH0"
export const supabase = createClient(supabaseUrl, supabaseKey);
