import { useState } from 'react';
import Icon from './Icon';

const ProductoSkeleton = () => <div className="product-card skeleton-card" aria-hidden="true"><div className="product-photo skeleton"/><div className="product-info"><div className="skeleton skeleton-line"/><div className="skeleton skeleton-line short"/><div className="skeleton skeleton-price"/></div></div>;

const ProductoCard = ({ producto, onOpen, index = 0 }) => {
    const [failed, setFailed] = useState(false);
    const available = producto.disponible !== false;
    return <article className="product-card" style={{ '--card-index': Math.min(index, 7) }}>
        <div className="product-photo">
            <span className={`stock-badge ${available ? '' : 'is-unavailable'}`}><span/>{available ? 'Disponible' : 'Agotado'}</span>
            {producto.imagen_url && !failed ? <img src={producto.imagen_url} alt={producto.nombre} loading="lazy" decoding="async" width="400" height="400" onError={() => setFailed(true)}/> : <span className="photo-placeholder"><Icon name="bag" size={44}/><span>Sin fotografía</span></span>}
            <span className="product-photo-action" aria-hidden="true"><Icon name="northeast" size={20}/></span>
        </div>
        <div className="product-info">
            <p className="product-brand">{producto.marca || producto.subcategorias?.nombre || 'Minitodo'}</p>
            <h3><button type="button" className="product-title" onClick={() => onOpen(producto)} aria-label={`Ver ${producto.nombre}, S/ ${Number(producto.precio).toFixed(2)}${available ? '' : ', agotado'}`}>{producto.nombre}</button></h3>
            <p className="product-presentation">{producto.presentacion || producto.subcategorias?.categorias?.nombre || 'Consulta los detalles del producto'}</p>
            <div className="product-bottom"><span className="product-price"><small>S/</small> {Number(producto.precio).toFixed(2)}</span><span className="product-link">Ver producto <Icon name="arrow" size={15}/></span></div>
        </div>
    </article>;
};

export { ProductoCard, ProductoSkeleton };
