import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uwwxkxdoiavwjnoygyrq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3d3hreGRvaWF2d2pub3lneXJxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MTcwNjc4MywiZXhwIjoyMDU3MjgyNzgzfQ.XT2jTdUOy4CBOy3HsRYk2R1FArYDBhhh3m2yxELEX7Y';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
