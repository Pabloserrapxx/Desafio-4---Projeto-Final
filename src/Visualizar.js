import React, { useEffect, useState } from 'react';
import './Visualizar.css';
import detranLogo from './img/logo.png';
import { useNavigate } from 'react-router-dom'; 
import { FaExclamationTriangle, FaCar, FaEdit } from 'react-icons/fa';
import { listarMotoristas, listarCarros, listarMultas } from './services/api';

const Visualizar = () => {
  const navigate = useNavigate();
  const [motoristas, setMotoristas] = useState([]);
  const [carros, setCarros] = useState([]);
  const [multas, setMultas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const motoristasList = await listarMotoristas();
        const carrosList = await listarCarros();
        const multasList = await listarMultas();
        setMotoristas(motoristasList);
        setCarros(carrosList);
        setMultas(multasList);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <img src={detranLogo} alt="DetranSys Logo" className="logo" />
        <div className="close-icon" onClick={() => navigate('/')}>✖</div>
      </div>
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Categoria CNH</th>
              <th>Vencimento CNH</th>
              <th>Veículos</th>
              <th>Multas</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {motoristas.map((motorista) => (
              <tr key={motorista.cpf}>
                <td>{motorista.nome}</td>
                <td>{motorista.cpf}</td>
                <td>{motorista.categoria_cnh}</td>
                <td>{motorista.vencimento_cnh}</td>
                <td>
                  
                        <FaCar 
                          className="veiculo-icon" onClick={() => navigate(`/veiculo/${motorista.cpf}`)}
                        />
                </td>
                <td>
                  
                        <FaExclamationTriangle 
                          className="multas-icon" onClick={() => navigate(`/multas`)}
                        />
                      
                </td>
                <td>
                  <FaEdit 
                    className="veiculo-icon" onClick={() => navigate(`/editar/${motorista.cpf}`)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="buttons">
        <button className="button" onClick={() => navigate('/Cadastrar_carro')}>Cadastrar Veículo</button>
        <button className="button" onClick={() => navigate('/cadastrar')}>Cadastrar Proprietário</button>
      </div>
    </div>
  );
};

export default Visualizar;