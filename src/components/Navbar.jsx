import Icon from './Icon';

export default function Navbar({ totalProductos, nombre = 'Minitodo Leoncito' }) {
    return <header className="site-header">
        <div className="page-shell header-inner">
            <a className="brand" href="#inicio" aria-label={nombre + ', inicio'}>
                <span className="brand-mark"><Icon name="store" size={27}/></span>
                <span className="brand-copy"><strong>{nombre}</strong><span>Tu bodega de siempre</span></span>
            </a>
            <nav className="desktop-nav" aria-label="Navegación principal">
                <a href="#productos">El catálogo <span className="nav-count">{totalProductos}</span></a>
                <a href="#bodega">Nuestra bodega</a>
            </nav>
            <a className="header-visit" href="#bodega"><span>Ven a visitarnos</span><Icon name="northeast" size={18}/></a>
        </div>
    </header>;
}
