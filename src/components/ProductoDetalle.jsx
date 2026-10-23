import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';

export default function ProductoDetalle({ producto, onClose }) {
    const dialog = useRef(null);
    const host = useRef(null);
    const [sinFoto, setSinFoto] = useState(false);

    useEffect(() => {
        const node = dialog.current;
        const overlay = host.current;
        const previousOverflow = document.body.style.overflow;
        const previousFocus = document.activeElement;
        const native = typeof node.showModal === 'function';
        document.body.style.overflow = 'hidden';
        if (native) node.showModal();
        else {
            overlay.classList.add('dialog-fallback');
            node.setAttribute('open', '');
            node.querySelector('button')?.focus();
        }
        const keyboard = event => {
            if (native) return;
            if (event.key === 'Escape') { event.preventDefault(); onClose(); }
            if (event.key === 'Tab') {
                const controls = Array.from(node.querySelectorAll('button, a[href], input, select, textarea, [tabindex="0"]')).filter(el => !el.disabled);
                const first = controls[0], last = controls[controls.length - 1];
                if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
                else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
            }
        };
        document.addEventListener('keydown', keyboard);
        return () => {
            document.removeEventListener('keydown', keyboard);
            if (native && node.open) node.close();
            else node.removeAttribute('open');
            document.body.style.overflow = previousOverflow;
            if (previousFocus?.isConnected && typeof previousFocus.focus === 'function') {
                try { previousFocus.focus({ preventScroll: true }); }
                catch { previousFocus.focus(); }
            }
        };
    }, [onClose]);

    const backdropClick = event => {
        if (event.target !== dialog.current) return;
        const rect = dialog.current.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose();
    };
    const available = producto.disponible !== false;

    return <div ref={host} onClick={e => { if (e.target === host.current) onClose(); }}>
        <dialog ref={dialog} role="dialog" onCancel={e => { e.preventDefault(); onClose(); }} onClick={backdropClick} aria-labelledby="detalle-titulo" aria-modal="true" className="product-dialog">
            <button autoFocus onClick={onClose} aria-label="Cerrar detalle del producto" className="dialog-close"><Icon name="close" size={20}/></button>
            <div className="detail-layout">
                <div className="detail-photo">{producto.imagen_url && !sinFoto ? <img src={producto.imagen_url} alt={producto.nombre} width="500" height="500" onError={() => setSinFoto(true)}/> : <span className="photo-placeholder"><Icon name="bag" size={64}/><span>Sin fotografía</span></span>}</div>
                <div className="detail-info">
                    <p className="eyebrow">{[producto.subcategorias?.categorias?.nombre, producto.subcategorias?.nombre].filter(Boolean).join(' / ') || 'Nuestro catálogo'}</p>
                    <h2 id="detalle-titulo">{producto.nombre}</h2>
                    <p className="detail-price"><small>S/</small> {Number(producto.precio).toFixed(2)}</p>
                    <p className={`detail-stock ${available ? '' : 'is-unavailable'}`}><Icon name={available ? 'check' : 'clock'} size={14}/>{available ? 'Disponible en la bodega' : 'Agotado por el momento'}</p>
                    {(producto.marca || producto.presentacion) && <dl className="detail-facts">{[['Marca', producto.marca], ['Presentación', producto.presentacion]].filter(([, v]) => v).map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>}
                    {producto.descripcion && <p className="detail-description">{producto.descripcion}</p>}
                </div>
            </div>
        </dialog>
    </div>;
}
