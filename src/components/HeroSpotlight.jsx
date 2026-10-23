import { useState } from 'react';
import Icon from './Icon';

function SpotlightImage({ producto }) {
    const [failed, setFailed] = useState(false);
    return producto.imagen_url && !failed
        ? <img src={producto.imagen_url} alt={producto.nombre} width="360" height="360" decoding="async" onError={() => setFailed(true)}/>
        : <span className="photo-placeholder"><Icon name="bag" size={64}/><span>De tu bodega</span></span>;
}

export default function HeroSpotlight({ productos, loading, onOpen }) {
    const [index, setIndex] = useState(0);
    const picks = productos.filter(p => p.disponible !== false).slice(0, 6);
    const actualIndex = picks.length ? index % picks.length : 0;
    const producto = picks[actualIndex];
    return <div className="spotlight" aria-label="Una mirada al catálogo">
        <span className="spotlight-orbit orbit-one" aria-hidden="true"/>
        <span className="spotlight-orbit orbit-two" aria-hidden="true"/>
        <span className="spotlight-stamp" aria-hidden="true">CERQUITA<br/>DE TI <span>✳</span></span>
        <span className="spotlight-caption"><span className="small-dot"/>Un vistazo a tu bodega</span>
        {producto ? <button className="spotlight-card" onClick={() => onOpen(producto)} aria-label={`Ver ${producto.nombre}`}>
            <div className="spotlight-photo" key={producto.id}><SpotlightImage producto={producto}/></div>
            <span className="spotlight-product"><span><small>{producto.marca || producto.subcategorias?.nombre || 'En nuestro catálogo'}</small><strong>{producto.nombre}</strong></span><span className="spotlight-price"><small>S/</small>{Number(producto.precio).toFixed(2)}</span></span>
            <span className="spotlight-open"><Icon name="northeast" size={18}/></span>
        </button> : <div className={`spotlight-card spotlight-empty ${loading ? 'is-loading' : ''}`}><Icon name="store" size={90}/><strong>{loading ? 'Preparando tu catálogo…' : 'Tu próxima parada favorita.'}</strong><span>Pequeña bodega. Grandes antojos.</span></div>}
        {picks.length > 1 && <div className="spotlight-controls"><button className="round-button" aria-label="Producto anterior" onClick={() => setIndex((actualIndex - 1 + picks.length) % picks.length)}><Icon name="chevron" className="icon-flip" size={18}/></button><span aria-live="polite" aria-atomic="true"><b>{String(actualIndex + 1).padStart(2, '0')}</b><span> / {String(picks.length).padStart(2, '0')}</span></span><button className="round-button" aria-label="Producto siguiente" onClick={() => setIndex((actualIndex + 1) % picks.length)}><Icon name="chevron" size={18}/></button></div>}
    </div>;
}
