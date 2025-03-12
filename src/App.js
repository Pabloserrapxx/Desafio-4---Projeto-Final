import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Entrada from './Entrada';
import Cadastrar from './Cadastrar';
import Visualizar from '../Visualizar';
import CadastrarCarro from './Cadastrar_carro'; 
import Multas from './Multas';

function App() {
  const fines = [
    { placa: 'ABC-1234', data: '2023-07-01', descricao: 'Excesso de velocidade', valor: 150 },
    { placa: 'DEF-5678', data: '2023-06-15', descricao: 'Estacionamento proibido', valor: 100 },
    // Adicione mais multas conforme necessário
  ];

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Entrada />} />
          <Route path="/tela2" element={<Cadastrar />} />
          <Route path="/visualizar" element={<Visualizar />} />
          <Route path="/Cadastrar_carro" element={<CadastrarCarro />} />
          <Route path="/multas" element={<Multas fines={fines} />} />
          <Route path="/veiculo/:cpf" element={<Veiculo />} /> {/* Adiciona a rota para Veiculo */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
