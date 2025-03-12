import React, {useState} from 'react';
import './Cadastrar.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from './img/logo.png';
import { cadastrarCarro } from './services/api';



const Cadastrar_carro = () => {
  const navigate = useNavigate();
  const [placa, setPlaca] = useState('')
  const [marca, setMarca] = useState('')
  const [modelo, setModelo] = useState('')
  const [ano, setAno] = useState('')
  const [cor, setCor] = useState('')
  const [cpf, setCpf] = useState('')
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    try{
      const carro = {placa, marca, modelo, ano, cor, cpf}
      const response = await cadastrarCarro(carro)
      alert("Carro cadastrado com sucesso!! ")
      console.log(response)
    } catch (error){
      alert('Erro ao cadastrar o carro: ' + error.message)
    }
  }

  return (
    <div className="cadastro-container">
      <FaArrowLeft className="back-icon" onClick={() => navigate('/visualizar')} />
      <img src={logo} alt="Detran SYS" className="logo" />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Placa</label>
            <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} placeholder="Digite a placa" required />
          </div>
          <div className="form-group">
            <label>Ano</label>
            <input type="text" value={ano} onChange={(e) => setAno(e.target.value)} placeholder="Digite o ano" required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Modelo</label>
              <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Digite o modelo" required />
            </div>
            <div className="form-group">
              <label>Cor</label>
              <input type="text" value={cor} onChange={(e) => setCor(e.target.value)} placeholder="Digite a cor" required />
            </div>
            <div className="form-group">
              <label>Marca</label>
              <input type="text" value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Digite a marca" required />
            </div>
          </div>
          <div className="form-group">
            <label>CPF do Motorista</label>
            <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} placeholder="Digite o ID do motorista" required />
          </div>
          <button className="submit-button" type="submit">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};
export default Cadastrar_carro;
