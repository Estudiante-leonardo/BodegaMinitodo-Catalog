import { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { ProductoCard, ProductoSkeleton } from '../components/ProductoCard';
import ProductoDetalle from '../components/ProductoDetalle';
import { getCatalogo } from '../services/catalogoService';
import { filtrarProductos } from '../lib/catalogFilters';

export default function Catalogo() {
    const [data,setData]=useState({productos:[],tienda:null});
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(false);
    const [reload,setReload]=useState(0);
    const [search,setSearch]=useState('');
    const [categoria,setCategoria]=useState('');
    const [subcategoria,setSubcategoria]=useState('');
    const [disponibles,setDisponibles]=useState(false);
    const [orden,setOrden]=useState('nombre-asc');
    const [limit,setLimit]=useState(24);
    const [detalle,setDetalle]=useState(null);
    useEffect(()=>{
        let active=true;
        getCatalogo().then(result=>{
            if(!active)return;
            setData(result);
            const id=new URLSearchParams(window.location.search).get('producto');
            setDetalle(result.productos.find(p=>p.id===id)||null);
            document.title=`${result.tienda.nombre} — Catálogo`;
            document.querySelector('meta[name="description"]')?.setAttribute('content',result.tienda.descripcion || `Consulta los productos de ${result.tienda.nombre}.`);
        }).catch(()=>{if(active)setError(true);}).finally(()=>{if(active)setLoading(false);});
        return ()=>{active=false;};
    },[reload]);
    const categorias=useMemo(()=>Array.from(new Map(data.productos.filter(p=>p.subcategorias?.categorias).map(p=>[p.subcategorias.categorias.id,p.subcategorias.categorias])).values()).sort((a,b)=>a.nombre.localeCompare(b.nombre,'es')),[data.productos]);
    const subs=useMemo(()=>Array.from(new Map(data.productos.filter(p=>p.subcategorias && (!categoria || String(p.subcategorias.categorias?.id)===categoria)).map(p=>[p.subcategorias.id,p.subcategorias])).values()).sort((a,b)=>a.nombre.localeCompare(b.nombre,'es')),[data.productos,categoria]);
    const resultados=useMemo(()=>filtrarProductos(data.productos,{search,categoria,subcategoria,disponibles,orden}),[data.productos,search,categoria,subcategoria,disponibles,orden]);
    const reset=()=>{setSearch('');setCategoria('');setSubcategoria('');setDisponibles(false);setLimit(24);};
    const open=producto=>{setDetalle(producto);const url=new URL(window.location.href);url.searchParams.set('producto',producto.id);window.history.replaceState(null,'',url);};
    const close=()=>{setDetalle(null);const url=new URL(window.location.href);url.searchParams.delete('producto');window.history.replaceState(null,'',url);};
    const tienda=data.tienda;
    return <div className="min-h-screen bg-dark-950 flex flex-col">
        <Navbar totalProductos={data.productos.length} nombre={tienda?.nombre}/>
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-10">
            <section className="catalog-hero mb-8"><p className="eyebrow mb-3">TU BODEGA, MÁS CERCA</p><h1 className="text-4xl sm:text-5xl font-bold leading-tight">Todo para tu <span className="text-brand-400">día a día.</span></h1><p className="text-slate-300 mt-4 max-w-xl">{tienda?.descripcion || 'Explora nuestros productos, encuentra lo que necesitas y consulta su disponibilidad.'}</p><a href="#productos" className="catalog-button inline-block mt-6">Explorar productos ↓</a></section>
            <section id="productos" aria-label="Catálogo de productos" className="scroll-mt-24">
                <div className="filter-panel glass rounded-2xl p-4 sm:p-5 mb-7">
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <label className="catalog-label">Buscar producto<input type="search" value={search} onChange={e=>{setSearch(e.target.value);setLimit(24);}} placeholder="Nombre, marca o presentación" className="catalog-input"/></label>
                        <label className="catalog-label">Categoría<select className="catalog-input" value={categoria} onChange={e=>{setCategoria(e.target.value);setSubcategoria('');setLimit(24);}}><option value="">Todas las categorías</option>{categorias.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}</select></label>
                        <label className="catalog-label">Subcategoría<select className="catalog-input" value={subcategoria} onChange={e=>{setSubcategoria(e.target.value);setLimit(24);}}><option value="">Todas las subcategorías</option>{subs.map(s=><option key={s.id} value={s.id}>{s.nombre}</option>)}</select></label>
                        <label className="catalog-label">Ordenar<select className="catalog-input" value={orden} onChange={e=>setOrden(e.target.value)}><option value="nombre-asc">Nombre A–Z</option><option value="nombre-desc">Nombre Z–A</option><option value="precio-asc">Menor precio</option><option value="precio-desc">Mayor precio</option></select></label>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3 mt-4"><label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked={disponibles} onChange={e=>{setDisponibles(e.target.checked);setLimit(24);}}/>Solo disponibles</label>{(search||categoria||subcategoria||disponibles)&&<button className="text-sm text-brand-300 underline" onClick={reset}>Limpiar filtros</button>}</div>
                </div>
                {error ? <div role="alert" className="glass rounded-2xl p-8 text-center"><p>No pudimos cargar el catálogo. Intenta nuevamente.</p><button className="catalog-button mt-4" onClick={()=>{setError(false);setLoading(true);setReload(n=>n+1);}}>Reintentar</button></div> : loading ? <div aria-label="Cargando productos" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({length:8},(_,i)=><ProductoSkeleton key={i}/>)}</div> : <>
                    <p role="status" className="text-sm text-slate-400 mb-4">{resultados.length} {resultados.length===1?'producto':'productos'}{resultados.length>limit?` · mostrando ${limit}`:''}</p>
                    {!resultados.length ? <div className="text-center py-16 glass rounded-2xl"><h2 className="text-xl font-semibold">{data.productos.length?'No encontramos productos con esos filtros':'Pronto agregaremos productos'}</h2>{data.productos.length>0&&<button onClick={reset} className="catalog-button mt-5">Ver todos los productos</button>}</div> : <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">{resultados.slice(0,limit).map(p=><ProductoCard key={p.id} producto={p} onOpen={open}/>)}</div>}
                    {resultados.length>limit&&<div className="text-center mt-8"><button className="catalog-button" onClick={()=>setLimit(n=>n+24)}>Mostrar más productos</button></div>}
                </>}
            </section>
            {tienda && <section aria-labelledby="tienda-titulo" className="glass rounded-3xl p-6 sm:p-8 mt-14"><p className="eyebrow">TE ESPERAMOS</p><h2 id="tienda-titulo" className="text-2xl font-bold mt-2">{tienda.nombre}</h2><dl className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">{[['Dirección',tienda.direccion],['Horario',tienda.horario],['Teléfono',tienda.telefono],['Correo',tienda.email],['Entrega',tienda.entrega],['Recojo',tienda.recojo]].filter(([,v])=>v).map(([label,value])=><div key={label}><dt className="text-sm text-brand-300 mb-1">{label}</dt><dd className="text-slate-300 whitespace-pre-line">{value}</dd></div>)}</dl></section>}
        </main>
        <footer className="border-t border-white/10 text-center py-6 text-xs text-slate-400">© {new Date().getFullYear()} {tienda?.nombre || 'Minitodo'} · Catálogo de productos</footer>
        {detalle&&<ProductoDetalle key={detalle.id} producto={detalle} onClose={close}/>}
    </div>;
}
