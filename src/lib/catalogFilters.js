export const normalizar = value => String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
export function filtrarProductos(productos, { search = '', categoria = '', subcategoria = '', disponibles = false, orden = 'nombre-asc' } = {}) {
    const terms = normalizar(search).split(/\s+/).filter(Boolean);
    return productos.filter(p => p.publicado !== false && (!disponibles || p.disponible !== false)
        && (!categoria || String(p.subcategorias?.categorias?.id) === String(categoria))
        && (!subcategoria || String(p.subcategoria_id) === String(subcategoria))
        && terms.every(t => normalizar([p.nombre,p.marca,p.presentacion,p.subcategorias?.nombre,p.subcategorias?.categorias?.nombre].join(' ')).includes(t)))
        .sort((a,b) => orden.startsWith('precio')
            ? (Number(a.precio)-Number(b.precio))*(orden.endsWith('asc')?1:-1)
            : a.nombre.localeCompare(b.nombre,'es')*(orden.endsWith('asc')?1:-1));
}
