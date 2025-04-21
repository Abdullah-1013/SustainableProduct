import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://yweqmaqruqnemntvpxel.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl3ZXFtYXFydXFuZW1udHZweGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA3OTQwOTgsImV4cCI6MjA0NjM3MDA5OH0.caT9BazwCZuil5X1d8zVWeBrZINRTPxQiyL4nxBHblA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
