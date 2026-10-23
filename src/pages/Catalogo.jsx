import { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { ProductoCard, ProductoSkeleton } from '../components/ProductoCard';
import ProductoDetalle from '../components/ProductoDetalle';
import HeroSpotlight from '../components/HeroSpotlight';
import Icon from '../components/Icon';
import { getCatalogo } from '../services/catalogoService';
import { filtrarProductos } from '../lib/catalogFilters';

export default function Catalogo() {
    const [data, setData] = useState({ productos: [], tienda: null });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [reload, setReload] = useState(0);
    const [search, setSearch] = useState('');
    const [categoria, setCategoria] = useState('');
    const [subcategoria, setSubcategoria] = useState('');
    const [disponibles, setDisponibles] = useState(false);
    const [orden, setOrden] = useState('nombre-asc');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [limit, setLimit] = useState(24);
    const [detalle, setDetalle] = useState(null);

    useEffect(() => {
        let active = true;
        getCatalogo().then(result => {
            if (!active) return;
            setData(result);
            const id = new URLSearchParams(window.location.search).get('producto');
            setDetalle(result.productos.find(p => p.id === id) || null);
            document.title = result.tienda.nombre + ' — Catálogo';
            document.querySelector('meta[name="description"]')?.setAttribute('content', result.tienda.descripcion || 'Consulta los productos de ' + result.tienda.nombre + '.');
        }).catch(() => { if (active) setError(true); }).finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [reload]);

    const categorias = useMemo(() => Array.from(new Map(
        data.productos.filter(p => p.subcategorias?.categorias).map(p => [p.subcategorias.categorias.id, p.subcategorias.categorias])
    ).values()).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')), [data.productos]);
    const subs = useMemo(() => Array.from(new Map(
        data.productos.filter(p => p.subcategorias && (!categoria || String(p.subcategorias.categorias?.id) === categoria)).map(p => [p.subcategorias.id, p.subcategorias])
    ).values()).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')), [data.productos, categoria]);
    const resultados = useMemo(() => filtrarProductos(data.productos, { search, categoria, subcategoria, disponibles, orden }), [data.productos, search, categoria, subcategoria, disponibles, orden]);
    const reset = () => { setSearch(''); setCategoria(''); setSubcategoria(''); setDisponibles(false); setLimit(24); };
    const chooseCategory = id => { setCategoria(String(id)); setSubcategoria(''); setLimit(24); };
    const open = useCallback(producto => {
        setDetalle(producto);
        const url = new URL(window.location.href);
        url.searchParams.set('producto', producto.id);
        window.history.replaceState(null, '', url);
    }, []);
    const close = useCallback(() => {
        setDetalle(null);
        const url = new URL(window.location.href);
        url.searchParams.delete('producto');
        window.history.replaceState(null, '', url);
    }, []);
    const tienda = data.tienda;
    const hasFilters = Boolean(search || categoria || subcategoria || disponibles);
    const filterCount = [categoria, subcategoria, disponibles].filter(Boolean).length;
    const showVisitTile = !hasFilters && resultados.length > 0 && resultados.length <= 2 && Boolean(tienda);

    return <div className="site-wrap" id="inicio">
        <a className="skip-link" href="#productos">Saltar al catálogo</a>
        <div className="announcement"><span className="small-dot"/>De tu barrio. Para tu día a día.<span className="announcement-right">Conoce tu bodega favorita <Icon name="arrow" size={14}/></span></div>
        <Navbar totalProductos={data.productos.length} nombre={tienda?.nombre}/>
        <main>
            <div className="page-shell">
                <section className="catalog-hero" aria-labelledby="hero-title">
                    <div className="hero-copy">
                        <p className="eyebrow hero-eyebrow"><span/>LA BODEGA DE LA ESQUINA, AHORA AQUÍ</p>
                        <h1 id="hero-title">Todo para tu día.<br/><span>A la vuelta</span><br/>de casa.</h1>
                        <p className="hero-description">{tienda?.descripcion || 'Descubre lo que necesitas y ese antojito que no sabías que querías.'}</p>
                        <div className="hero-actions"><a className="button button-cream" href="#productos">Explorar el catálogo <Icon name="arrow"/></a><a className="hero-secondary" href="#bodega">Conoce la bodega <Icon name="northeast" size={16}/></a></div>
                        {tienda?.direccion && <a className="hero-address" href="#bodega"><Icon name="pin" size={17}/>{tienda.direccion}</a>}
                    </div>
                    <HeroSpotlight productos={data.productos} loading={loading} onOpen={open}/>
                    <span className="hero-background-word" aria-hidden="true">minitodo</span>
                </section>
                <div className="benefit-strip" aria-label="Acerca del catálogo">
                    <span><Icon name="bag"/><span>Un poquito de todo</span></span>
                    <span><Icon name="search"/><span>Encuentra y compara</span></span>
                    <span><Icon name="store"/><span>Te esperamos en la bodega</span></span>
                </div>

                <section id="productos" className="catalog-section" aria-labelledby="catalog-title" aria-busy={loading}>
                    <div className="section-heading">
                        <div><p className="eyebrow">EXPLORA A TU RITMO</p><h2 id="catalog-title">¿Qué necesitas hoy<span>?</span></h2></div>
                        <p>De lo esencial a tu próximo antojo.<br/>Todo empieza por una mirada.</p>
                    </div>
                    <div className="category-row" role="group" aria-label="Filtrar por categoría">
                        <button className={`category-chip ${!categoria ? 'is-active' : ''}`} aria-pressed={!categoria} onClick={() => chooseCategory('')}><Icon name="bag" size={17}/>Todo el catálogo<span>{data.productos.length}</span></button>
                        {categorias.map(c => <button key={c.id} className={`category-chip ${categoria === String(c.id) ? 'is-active' : ''}`} aria-pressed={categoria === String(c.id)} onClick={() => chooseCategory(c.id)}>{c.nombre}<span>{data.productos.filter(p => p.subcategorias?.categorias?.id === c.id).length}</span></button>)}
                    </div>
                    <div className="filter-panel">
                        <div className="search-row">
                            <label className="search-field"><Icon name="search" size={21}/><span className="sr-only">Buscar producto por nombre, marca o presentación</span><input type="search" value={search} onChange={e => { setSearch(e.target.value); setLimit(24); }} placeholder="¿Qué estás buscando?" autoComplete="off"/></label>
                            <button className={`filter-toggle ${filterCount ? 'has-filters' : ''}`} aria-expanded={filtersOpen} aria-controls="catalog-filters" onClick={() => setFiltersOpen(v => !v)}><Icon name="filter" size={19}/>Filtros{filterCount > 0 && <span>{filterCount}</span>}</button>
                        </div>
                        <div id="catalog-filters" className={`filter-options ${filtersOpen ? 'is-open' : ''}`}>
                            <label className="field-label">Categoría<select value={categoria} onChange={e => chooseCategory(e.target.value)}><option value="">Todas las categorías</option>{categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}</select></label>
                            <label className="field-label">Subcategoría<select value={subcategoria} onChange={e => { setSubcategoria(e.target.value); setLimit(24); }}><option value="">Todas las subcategorías</option>{subs.map(s => <option key={s.id} value={s.id}>{s.nombre}</option>)}</select></label>
                            <label className="availability-switch"><input type="checkbox" checked={disponibles} onChange={e => { setDisponibles(e.target.checked); setLimit(24); }}/><span className="switch-track" aria-hidden="true"/><span>Solo disponibles</span></label>
                        </div>
                    </div>
                    {hasFilters && <div className="active-filters">
                        {search && <button onClick={() => { setSearch(''); setLimit(24); }} aria-label="Quitar búsqueda"><span>“{search}”</span><Icon name="close" size={14}/></button>}
                        {categoria && <button onClick={() => chooseCategory('')} aria-label="Quitar categoría"><span>{categorias.find(c => String(c.id) === categoria)?.nombre}</span><Icon name="close" size={14}/></button>}
                        {subcategoria && <button onClick={() => { setSubcategoria(''); setLimit(24); }} aria-label="Quitar subcategoría"><span>{subs.find(s => String(s.id) === subcategoria)?.nombre}</span><Icon name="close" size={14}/></button>}
                        {disponibles && <button onClick={() => { setDisponibles(false); setLimit(24); }}>Solo disponibles<Icon name="close" size={14}/></button>}
                        <button className="clear-filters" onClick={reset}>Limpiar todo</button>
                    </div>}
                    <div className="results-toolbar">
                        <p role="status" aria-atomic="true">{loading ? 'Preparando el catálogo…' : error ? 'Catálogo no disponible' : <><strong>{resultados.length}</strong> {resultados.length === 1 ? 'producto' : 'productos'}{resultados.length > limit ? ` · mostrando ${limit}` : ''}</>}</p>
                        <label className="sort-control"><span>Ordenar:</span><select aria-label="Ordenar productos" value={orden} onChange={e => setOrden(e.target.value)}><option value="nombre-asc">Nombre A–Z</option><option value="nombre-desc">Nombre Z–A</option><option value="precio-asc">Menor precio</option><option value="precio-desc">Mayor precio</option></select></label>
                    </div>
                    {error ? <div role="alert" className="empty-state"><span className="empty-icon"><Icon name="store" size={34}/></span><h3>Nos falta un momentito.</h3><p>No pudimos cargar el catálogo. Vuelve a intentarlo.</p><button className="button button-red" onClick={() => { setError(false); setLoading(true); setReload(n => n + 1); }}>Volver a intentar<Icon name="arrow"/></button></div>
                    : loading ? <div className="product-grid" aria-label="Cargando productos">{Array.from({ length: 8 }, (_, i) => <ProductoSkeleton key={i}/>)}</div>
                    : !resultados.length ? <div className="empty-state"><span className="empty-icon"><Icon name="search" size={34}/></span><h3>{data.productos.length ? 'Probemos con otra búsqueda.' : 'Algo bueno está por llegar.'}</h3><p>{data.productos.length ? 'Prueba otro nombre o quita algún filtro para ver más productos.' : 'Pronto encontrarás nuestros productos por aquí.'}</p>{data.productos.length > 0 && <button onClick={reset} className="button button-red">Ver todo el catálogo<Icon name="arrow"/></button>}</div>
                    : <div className={`product-grid ${resultados.length <= 3 ? 'compact-grid compact-grid-' + resultados.length : ''} ${showVisitTile ? 'has-visit-tile' : ''}`}>
                        {resultados.slice(0, limit).map((p, i) => <ProductoCard key={p.id} producto={p} index={i} onOpen={open}/>)}
                        {showVisitTile && <aside className="visit-tile"><span className="eyebrow">TU BODEGA DE SIEMPRE</span><span className="visit-tile-symbol" aria-hidden="true"><Icon name="store" size={64}/></span><h3>Pasa por<br/>tu bodega<span>.</span></h3><p>{tienda.direccion || tienda.nombre}</p><a href="#bodega">Conoce la bodega<span><Icon name="arrow" size={18}/></span></a></aside>}
                    </div>}
                    {resultados.length > limit && <div className="load-more"><p>Has visto {Math.min(limit, resultados.length)} de {resultados.length} productos</p><div className="load-progress"><span style={{ width: (limit / resultados.length * 100) + '%' }}/></div><button className="button button-outline" onClick={() => setLimit(n => n + 24)}>Descubrir más productos<Icon name="arrow"/></button></div>}
                </section>

                <section id="bodega" className="store-section" aria-labelledby="store-title">
                    <div className="store-intro"><span className="store-symbol" aria-hidden="true"><Icon name="store" size={52}/></span><p className="eyebrow">DE LA PANTALLA A TU BARRIO</p><h2 id="store-title">Aquí siempre<br/>eres bienvenido<span>.</span></h2><p>Ya viste el catálogo.<br/>Ahora date una vuelta por {tienda?.nombre || 'nuestra bodega'}.</p>{tienda?.direccion && <a className="button button-red" target="_blank" rel="noopener noreferrer" href={'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(tienda.nombre + ' ' + tienda.direccion)}>Buscar dirección<Icon name="northeast" size={18}/><span className="sr-only"> (abre Google Maps en otra pestaña)</span></a>}</div>
                    <div className="store-card">
                        <div className="store-card-heading"><span className="brand-mark"><Icon name="store" size={25}/></span><div><p>Tu bodega de siempre</p><h3>{tienda?.nombre || 'Minitodo Leoncito'}</h3></div></div>
                        {tienda ? <dl className="store-details">
                            {tienda.direccion && <div><Icon name="pin"/><div><dt>Nos encuentras en</dt><dd>{tienda.direccion}</dd></div></div>}
                            {tienda.horario && <div><Icon name="clock"/><div><dt>Ven a visitarnos</dt><dd>{tienda.horario}</dd></div></div>}
                            {tienda.telefono && <div><Icon name="phone"/><div><dt>¿Tienes alguna consulta?</dt><dd><a href={'tel:' + tienda.telefono.replace(/[^\d+]/g, '')}>{tienda.telefono}<Icon name="northeast" size={14}/></a></dd></div></div>}
                            {tienda.email && <div><Icon name="share"/><div><dt>Escríbenos</dt><dd><a href={'mailto:' + tienda.email}>{tienda.email}</a></dd></div></div>}
                            {[['Entrega', tienda.entrega], ['Recojo', tienda.recojo]].filter(([, v]) => v).map(([label, value]) => <div key={label}><Icon name="bag"/><div><dt>{label}</dt><dd>{value}</dd></div></div>)}
                        </dl> : <p className="store-unavailable">{loading ? 'Cargando la información de la bodega…' : 'La información de contacto estará disponible cuando se restablezca el catálogo.'}</p>}
                        <div className="store-card-foot"><span className="small-dot"/>Lo cotidiano sabe mejor cerquita.</div>
                    </div>
                </section>
            </div>
        </main>
        <footer className="site-footer page-shell"><a className="footer-brand" href="#inicio">{tienda?.nombre || 'Minitodo Leoncito'}<span>Un poquito de todo, cerca de ti.</span></a><p>© {new Date().getFullYear()} · Catálogo de productos</p><a className="back-top" href="#inicio">Volver arriba<Icon name="up" size={17}/></a></footer>
        <nav className="mobile-nav" aria-label="Navegación móvil"><a href="#productos"><Icon name="bag"/><span>Catálogo</span></a><a href="#bodega"><Icon name="pin"/><span>La bodega</span></a><a href="#inicio"><Icon name="up"/><span>Arriba</span></a></nav>
        {detalle && <ProductoDetalle key={detalle.id} producto={detalle} onClose={close}/>}
    </div>;
}
