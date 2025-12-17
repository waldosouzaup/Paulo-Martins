import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mkadaugyoptuptxlgpdq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1rYWRhdWd5b3B0dXB0eGxncGRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5NzE4NjEsImV4cCI6MjA4MTU0Nzg2MX0.ey7aqjXJ0XMlxddvF8HY1hlB5UdXLS90qP-iHx6YZLw';

export const supabase = createClient(supabaseUrl, supabaseKey);