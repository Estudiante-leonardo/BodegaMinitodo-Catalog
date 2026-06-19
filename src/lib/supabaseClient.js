import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL     = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error('Faltan variables de entorno de Supabase. Verifica tu archivo .env');
}

// Cliente con solo anon key — lectura pública, sin capacidad de escritura
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
