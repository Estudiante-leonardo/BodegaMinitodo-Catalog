import { supabase } from '../lib/supabaseClient';

/**
 * Obtiene todos los productos del catálogo ordenados por nombre.
 * Solo lectura — usa anon key con permisos de SELECT.
 */
export async function getProductos() {
    const { data, error } = await supabase
        .from('productos')
        .select('id, nombre, precio, imagen_url')
        .order('nombre', { ascending: true });

    if (error) throw error;
    return data ?? [];
}
