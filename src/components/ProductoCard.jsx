import { useState } from 'react';
const ProductoSkeleton = () => <div className="glass rounded-2xl overflow-hidden"><div className="skeleton w-full aspect-square"/><div className="p-4 space-y-3"><div className="skeleton h-4 rounded-lg w-3/4"/><div className="skeleton h-3 rounded-lg w-1/2"/></div></div>;
const ProductoCard = ({ producto, onOpen }) => {
    const [failed,setFailed]=useState(false);
    return <button type="button" onClick={()=>onOpen(producto)} aria-label={`Ver ${producto.nombre}`} className="product-card glass rounded-2xl overflow-hidden text-left flex flex-col group">
        <div className="relative aspect-square w-full bg-white p-4 flex items-center justify-center">
            {producto.imagen_url && !failed ? <img src={producto.imagen_url} alt={producto.nombre} loading="lazy" decoding="async" width="400" height="400" className="h-full w-full object-contain transition-transform group-hover:scale-105" onError={()=>setFailed(true)}/> : <span className="text-slate-500 text-sm">Sin fotografía</span>}
            {producto.disponible===false && <span className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-semibold">Agotado</span>}
        </div>
        <div className="p-4 flex flex-col flex-1 w-full">
            <p className="text-xs text-slate-400 truncate">{producto.marca || producto.subcategorias?.nombre || 'Minitodo'}</p>
            <h3 className="text-sm font-semibold text-white mt-1 mb-2 line-clamp-2">{producto.nombre}</h3>
            {producto.presentacion && <p className="text-xs text-slate-400 mb-3">{producto.presentacion}</p>}
            <div className="mt-auto flex flex-wrap gap-2 items-end justify-between"><span className="text-brand-400 font-bold text-lg">S/ {Number(producto.precio).toFixed(2)}</span><span className="text-xs text-slate-400">Ver detalle ↗</span></div>
        </div>
    </button>;
};
export { ProductoCard, ProductoSkeleton };
