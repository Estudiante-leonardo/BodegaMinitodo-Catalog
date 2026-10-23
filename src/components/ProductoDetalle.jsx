import { useEffect, useRef, useState } from 'react';

export default function ProductoDetalle({ producto, onClose }) {
    const dialog = useRef(null);
    const [copiado,setCopiado] = useState(false);
    const [sinFoto,setSinFoto] = useState(false);
    const [copyError,setCopyError] = useState(false);
    useEffect(() => {
        const node=dialog.current;
        const previous=document.body.style.overflow;
        document.body.style.overflow='hidden';
        node.showModal();
        return () => { node.close(); document.body.style.overflow=previous; };
    },[]);
    const copy = async () => {
        try { const url=new URL(window.location.href); url.searchParams.set('producto',producto.id); await navigator.clipboard.writeText(url.href); setCopiado(true); }
        catch { setCopiado(false); setCopyError(true); }
    };
    return <dialog ref={dialog} onCancel={onClose} onClick={e=>{if(e.target===dialog.current) onClose();}} aria-labelledby="detalle-titulo" className="product-dialog">
        <button autoFocus onClick={onClose} aria-label="Cerrar detalle" className="dialog-close">✕</button>
        <div className="detail-layout">
            <div className="detail-photo">{producto.imagen_url && !sinFoto ? <img src={producto.imagen_url} alt={producto.nombre} onError={()=>setSinFoto(true)}/> : <span>Sin fotografía</span>}</div>
            <div className="detail-info">
                <p className="eyebrow">{[producto.subcategorias?.categorias?.nombre,producto.subcategorias?.nombre].filter(Boolean).join(' / ') || 'Nuestro catálogo'}</p>
                <h2 id="detalle-titulo" className="text-3xl font-bold mt-3">{producto.nombre}</h2>
                <p className="text-3xl font-bold text-brand-400 my-5">S/ {Number(producto.precio).toFixed(2)}</p>
                <p className={producto.disponible===false?'text-amber-300':'text-emerald-300'}>{producto.disponible===false?'Agotado por el momento':'Disponible'}</p>
                <dl className="my-5 space-y-3">{[['Marca',producto.marca],['Presentación',producto.presentacion]].filter(([,v])=>v).map(([k,v])=><div key={k}><dt className="text-xs text-slate-400">{k}</dt><dd>{v}</dd></div>)}</dl>
                {producto.descripcion && <p className="text-slate-300 whitespace-pre-line leading-relaxed">{producto.descripcion}</p>}
                <button onClick={copy} className="catalog-button mt-6">{copiado?'Enlace copiado':'Copiar enlace del producto'}</button>
                <span role="status" className="sr-only">{copiado?'Enlace copiado':''}</span>
                {copyError&&<p role="status" className="text-sm text-slate-400 mt-3">Puedes copiar el enlace desde la barra de direcciones.</p>}
            </div>
        </div>
    </dialog>;
}
