import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import MultaForm from './MultaForm';
import MotoristaForm from './MotoristaForm';
import VeiculoForm from './VeiculoForm';



const Icon = ({ name }) => {
  switch (name) {
    case 'Home': return <Home />;
    case 'Multas': return ;
    case 'Motoristas': return ;
    case 'Veiculos': return ;
    case 'Sair': return ;
    default: return null;
  }
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<MultaForm />} />
            <Route path="/multas" element={<MultaForm />} />
            <Route path="/motoristas" element={<MotoristaForm />} />
            <Route path="/veiculos" element={<VeiculoForm />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src="https://thumbs.dreamstime.com/z/icono-de-multa-polic%C3%ADa-ilustraci%C3%B3n-vectores-plano-y-aislado-con-dise%C3%B1o-m%C3%ADnimo-sombra-larga-117821678.jpg" alt="Panelas Grill Logo" />
      </div>
      <nav>
        <ul>
          
          <li>
            <Link to="/multas" className={location.pathname === '/multas' ? 'active' : ''}>
              <Icon name="Multas" /> Cadastrar Multa
            </Link>
          </li>
          <li>
            <Link to="/motoristas" className={location.pathname === '/motoristas' ? 'active' : ''}>
              <Icon name="Motoristas" /> Cadastrar Motorista
            </Link>
          </li>
          <li>
            <Link to="/veiculos" className={location.pathname === '/veiculos' ? 'active' : ''}>
              <Icon name="Veiculos" /> Cadastrar Veículo
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

function HomeContent() {
  return <div className="home-content"></div>;
}

export default App;
