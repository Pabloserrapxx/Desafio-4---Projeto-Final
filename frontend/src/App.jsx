import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import MultaForm from './MultaForm';
import MotoristaForm from './MotoristaForm';
import VeiculoForm from './VeiculoForm';
import ConsultaMotoristas from './ConsultaMotoristas';
import ConsultaGeral from './ConsultaGeral'; // Importe o ConsultaGeral


function App() {
  return (
    <Router>
      <div className="App">
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/multas">Cadastrar Multa</Link>
            </li>
            <li>
              <Link to="/motoristas">Cadastrar Motorista</Link>
            </li>
            <li>
              <Link to="/veiculos">Cadastrar Veículo</Link>
            </li>
            <li>
              <Link to="/consultar-motoristas">Consultar Motoristas</Link>
            </li>
            <li>
              <Link to="/consultas">Consultas Gerais</Link> {/* Link para ConsultaGeral */}
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h1>Página Inicial</h1>} />
          <Route path="/multas" element={<MultaForm />} />
          <Route path="/motoristas" element={<MotoristaForm />} />
          <Route path="/veiculos" element={<VeiculoForm />} />
          <Route path="/consultar-motoristas" element={<ConsultaMotoristas />} />
          <Route path="/consultas" element={<ConsultaGeral />} /> {/* Rota para ConsultaGeral */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;