import Catalogo from './pages/Catalogo';
import Icon from './components/Icon';
import './index.css';

function App() {
  const [entering, setEntering] = useState(() => Boolean(window.matchMedia?.('(prefers-reduced-motion: no-preference)')?.matches));
  useEffect(() => {
    if (!entering) return;
    const timeout = window.setTimeout(() => setEntering(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [entering]);

  return <div className={`entry-shell${entering ? ' is-entering' : ''}`} onFocusCapture={() => setEntering(false)} onPointerDownCapture={() => setEntering(false)}>
    {entering && <div className="entry-curtain" aria-hidden="true" onAnimationEnd={event => {
      if (event.target === event.currentTarget && event.animationName === 'entry-reveal') setEntering(false);
    }}>
      <div className="entry-brand"><span className="entry-mark"><Icon name="store" size={40}/></span><strong>Minitodo Leoncito</strong><span>Tu bodega de siempre</span></div>
    </div>}
    <Catalogo />
  </div>;
}

export default App;
import { useEffect, useState } from 'react';
