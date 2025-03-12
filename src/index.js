import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Entrada from './Entrada'; // Importa o componente Entrada
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cadastrar from './Cadastrar'; // Importa o componente Cadastrar
import Visualizar from './Visualizar'; // Importa o componente Visualizar
import Carro from './Cadastrar_carro'; // Certifique-se de que o nome do arquivo está correto
import Multas from './Multas';
import Veiculo from './Veiculo'; // Importa o componente Veiculo

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Entrada />} />
        <Route path="/cadastrar" element={<Cadastrar />} />
        <Route path="/visualizar" element={<Visualizar />} />
        <Route path="/Cadastrar_carro" element={<Carro />} />
        <Route path="/Multas" element={<Multas />} />
        <Route path="/veiculo/:cpf" element={<Veiculo />} /> {/* Adiciona a rota para Veiculo */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
