import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = "https://fiwgairrhbqfyasihbhc.supabase.co";
const DEFAULT_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpd2dhaXJyaGJxZnlhc2loYmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQzNzEsImV4cCI6MjA5MDk2MDM3MX0.bbcQT-uxw345AggUooVllMCrPNlY1PFzeAbjOElrNxE";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY;

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('Using default Supabase credentials from .env.example. For production, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment settings.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
