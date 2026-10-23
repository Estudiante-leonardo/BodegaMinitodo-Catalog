import { supabase } from '../lib/supabaseClient';

/**
 * Obtiene todos los productos del catálogo ordenados por nombre.
 * Solo lectura — usa anon key con permisos de SELECT.
 */
export async function getProductos() {
    const { data, error } = await supabase
        .from('productos')
        .select('id,nombre,precio,imagen_url,descripcion,marca,presentacion,disponible,publicado,subcategoria_id,subcategorias(id,nombre,categorias(id,nombre))')
        .eq('publicado', true)
        .order('nombre', { ascending: true });

    if (error) throw error;
    return data ?? [];
}

export async function getCatalogo() {
    const [productos, tiendaResult] = await Promise.all([getProductos(), supabase.from('tienda').select('*').eq('id',1).single()]);
    if (tiendaResult.error) throw tiendaResult.error;
    return { productos, tienda: tiendaResult.data };
}
