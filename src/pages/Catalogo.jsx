import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { ProductoCard, ProductoSkeleton } from '../components/ProductoCard';
import { getProductos } from '../services/catalogoService';

/* ── Opciones de orden ── */
const SORT_OPTIONS = [
    { value: 'nombre-asc',  label: 'Nombre A→Z' },
    { value: 'nombre-desc', label: 'Nombre Z→A' },
    { value: 'precio-asc',  label: 'Precio: menor a mayor' },
    { value: 'precio-desc', label: 'Precio: mayor a menor' },
];

const Catalogo = () => {
    const [productos, setProductos]   = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);
    const [search, setSearch]         = useState('');
    const [sortBy, setSortBy]         = useState('nombre-asc');

    /* ── Carga inicial ── */
    useEffect(() => {
        getProductos()
            .then(setProductos)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    /* ── Filtrar + ordenar ── */
    const filtrados = useMemo(() => {
        let lista = productos.filter(p =>
            p.nombre?.toLowerCase().includes(search.toLowerCase())
        );

        const [campo, dir] = sortBy.split('-');
        lista.sort((a, b) => {
            if (campo === 'precio') {
                return dir === 'asc'
                    ? Number(a.precio) - Number(b.precio)
                    : Number(b.precio) - Number(a.precio);
            }
            return dir === 'asc'
                ? a.nombre.localeCompare(b.nombre)
                : b.nombre.localeCompare(a.nombre);
        });

        return lista;
    }, [productos, search, sortBy]);

    return (
        <div className="min-h-screen flex flex-col bg-dark-950">

            {/* ── Decoración de fondo ── */}
            <div className="fixed inset-0 pointer-events-none -z-0 overflow-hidden">
                <div className="absolute -top-32 -left-32 w-96 h-96 bg-brand-700/15 rounded-full blur-3xl" />
                <div className="absolute top-1/2 -right-24 w-72 h-72 bg-brand-600/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 w-80 h-80 bg-brand-800/10 rounded-full blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: 'linear-gradient(rgba(244,63,94,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(244,63,94,.5) 1px, transparent 1px)',
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            {/* ── Navbar ── */}
            <Navbar totalProductos={productos.length} />

            {/* ── Contenido principal ── */}
            <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">

                {/* Hero */}
                <div className="text-center mb-12 animate-fade-up">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-brand-600/15 border border-brand-500/25 text-brand-400 text-xs font-semibold uppercase tracking-widest mb-4">
                        Catálogo completo
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight">
                        Todo lo que<br />
                        <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
                            necesitas
                        </span>
                    </h1>
                    <p className="text-slate-400 text-base max-w-md mx-auto">
                        Útiles, papelería y artículos escolares al mejor precio
                    </p>
                </div>

                {/* Controles: búsqueda + orden */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8">
                    {/* Búsqueda */}
                    <div className="relative flex-1">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            id="search-input"
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Buscar producto..."
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-slate-500
                                       focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                       hover:border-white/20 transition-all duration-200"
                        />
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                                aria-label="Limpiar búsqueda"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Ordenar */}
                    <div className="relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                        </svg>
                        <select
                            id="sort-select"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl pl-11 pr-10 py-3.5 text-sm text-white
                                       focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
                                       hover:border-white/20 transition-all duration-200 appearance-none cursor-pointer sm:min-w-52"
                        >
                            {SORT_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value} className="bg-dark-800 text-white">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Estado: error */}
                {error && (
                    <div className="glass rounded-2xl p-6 border border-brand-500/30 bg-brand-900/20 text-center mb-8">
                        <p className="text-brand-300 font-semibold">⚠️ No se pudo cargar el catálogo</p>
                        <p className="text-slate-500 text-sm mt-1">{error}</p>
                    </div>
                )}

                {/* Estado: cargando */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <ProductoSkeleton key={i} />
                        ))}
                    </div>
                )}

                {/* Estado: sin resultados */}
                {!loading && !error && filtrados.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-500">
                        <svg className="w-16 h-16 mb-4 opacity-25" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <p className="font-semibold text-lg">
                            {search ? `Sin resultados para "${search}"` : 'El catálogo está vacío por ahora'}
                        </p>
                        <p className="text-sm mt-1">
                            {search ? 'Intenta con otro término de búsqueda' : 'Pronto agregaremos productos'}
                        </p>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                className="mt-4 px-5 py-2 rounded-xl bg-brand-600/20 border border-brand-500/30 text-brand-400 hover:text-brand-300 text-sm font-semibold transition-colors"
                            >
                                Ver todos los productos
                            </button>
                        )}
                    </div>
                )}

                {/* Grid de productos */}
                {!loading && !error && filtrados.length > 0 && (
                    <>
                        {/* Resumen */}
                        <p className="text-xs text-slate-600 mb-5 font-medium">
                            Mostrando{' '}
                            <span className="text-slate-400">{filtrados.length}</span>
                            {' '}de{' '}
                            <span className="text-slate-400">{productos.length}</span>
                            {' '}productos
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {filtrados.map((producto, i) => (
                                <div key={producto.id} style={{ animationDelay: `${i * 40}ms` }}>
                                    <ProductoCard producto={producto} />
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>

            {/* ── Footer ── */}
            <footer className="relative z-10 border-t border-white/5 py-8 text-center">
                <p className="text-xs text-slate-600">
                    © {new Date().getFullYear()}{' '}
                    <span className="text-brand-500 font-semibold">minitodo</span>
                    {' '}— Catálogo en línea
                </p>
            </footer>
        </div>
    );
};

export default Catalogo;
