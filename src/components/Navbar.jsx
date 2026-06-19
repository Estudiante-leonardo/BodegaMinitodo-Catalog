const Navbar = ({ totalProductos }) => (
    <header className="sticky top-0 z-30 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">

            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md shadow-brand-700/40 animate-pulse-glow">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                </div>
                <div>
                    <p className="text-base font-bold text-white leading-tight tracking-tight">minitodo</p>
                    <p className="text-[10px] text-brand-400 font-semibold uppercase tracking-wider leading-none">Tienda</p>
                </div>
            </div>

            {/* Badge cantidad */}
            {totalProductos > 0 && (
                <span className="text-xs text-slate-500 font-medium hidden sm:block">
                    {totalProductos} producto{totalProductos !== 1 ? 's' : ''} disponible{totalProductos !== 1 ? 's' : ''}
                </span>
            )}

        </div>
    </header>
);

export default Navbar;
