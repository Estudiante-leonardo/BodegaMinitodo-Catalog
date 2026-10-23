import Catalogo from './pages/Catalogo';
import Icon from './components/Icon';
import './index.css';

function App() {
  return <div className="entry-shell">
    <div className="entry-curtain" aria-hidden="true">
      <div className="entry-brand"><span className="entry-mark"><Icon name="store" size={40}/></span><strong>Minitodo Leoncito</strong><span>Tu bodega de siempre</span></div>
    </div>
    <Catalogo />
  </div>;
}

export default App;
