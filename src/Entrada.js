import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Entrada.css';
import detranLogo from './img/logo.png';

const Entrada = () => {
  const navigate = useNavigate();

  return (
    <div className="entrada-container">
      <div className="entrada-card">
        <img src={detranLogo} alt="Detran Sys" className="detran-logo" />
        <h1 className="titulo">Bem-vindo ao Detran Flex</h1>
        <p className="descricao">Administre suas informações, veículos e infrações de maneira eficaz e sem complicações. Simplifique o processo de gestão e tenha tudo ao seu alcance com facilidade.</p>
        <div className="button-container">
          <button className="button cadastrar" onClick={() => navigate('/Cadastrar')}>Cadastrar</button>
          <button className="button visualizar" onClick={() => navigate('/visualizar')}>Visualizar</button>
        </div>
      </div>
    </div>
  );
};

export default Entrada;
