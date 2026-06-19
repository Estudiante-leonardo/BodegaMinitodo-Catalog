/* Skeleton card mientras cargan los productos */
const ProductoSkeleton = () => (
    <div className="glass rounded-2xl overflow-hidden">
        <div className="skeleton w-full aspect-square" />
        <div className="p-4 space-y-3">
            <div className="skeleton h-4 rounded-lg w-3/4" />
            <div className="skeleton h-3 rounded-lg w-1/2" />
            <div className="skeleton h-8 rounded-xl w-full mt-2" />
        </div>
    </div>
);

/* Tarjeta de producto */
const ProductoCard = ({ producto }) => {
    const { nombre, precio, imagen_url } = producto;

    return (
        <div className="glass rounded-2xl overflow-hidden group hover:border-brand-500/30 hover:shadow-lg hover:shadow-brand-900/30 transition-all duration-300 animate-fade-up flex flex-col">
            {/* Imagen */}
            <div className="relative w-full aspect-square bg-dark-800 overflow-hidden">
                {imagen_url ? (
                    <img
                        src={imagen_url}
                        alt={nombre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                    />
                ) : null}
                {/* Fallback cuando no hay imagen */}
                <div
                    className="absolute inset-0 flex items-center justify-center bg-dark-800"
                    style={{ display: imagen_url ? 'none' : 'flex' }}
                >
                    <svg className="w-16 h-16 text-dark-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                {/* Badge de precio superpuesto */}
                <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-600/90 backdrop-blur-sm text-white text-xs font-bold shadow-lg">
                        S/ {Number(precio).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2 flex-1 mb-3">
                    {nombre}
                </h3>
                <div className="flex items-center justify-between">
                    <span className="text-brand-400 font-bold text-base">
                        S/ {Number(precio).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">
                        Disponible
                    </span>
                </div>
            </div>
        </div>
    );
};

export { ProductoCard, ProductoSkeleton };
