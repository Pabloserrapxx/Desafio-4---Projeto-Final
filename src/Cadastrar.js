// src/Cadastrar.js
import React, {useState} from 'react';
import './Cadastrar.css';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import logo from './img/logo.png';
import { cadastrarMotorista } from './services/api';

const Cadastrar = () => {
  const navigate = useNavigate();
  const [nome,setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [vencimento_cnh, setVencimentoCnh] = useState('')
  const [categoria_cnh, setCategoriaCnh] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      const motorista = {nome,cpf,vencimento_cnh,categoria_cnh}
      console.log('Dados do motorista: ' + motorista)
      const response = await cadastrarMotorista(motorista)
      alert('Motorista cadastrado com sucesso!')
      console.log(response);
    } catch (error){
      alert('Erro ao cadastrar motorista: '+ error.message)
      console.error("error")
    }
  }

  return (
    <div className="cadastro-container">
      <FaArrowLeft className="back-icon" onClick={() => navigate('/')} />
      <img src={logo} alt="Detran SYS" className="logo" />
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input type="text" value={nome} onChange = {(e) => setNome(e.target.value)} placeholder="Digite o nome" required/>
          </div>
          <div className="form-group">
            <label>CPF</label>
            <input type="text" value={cpf} onChange = {(e) => setCpf(e.target.value)} placeholder="Digite o CPF" required/>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Categoria CNH</label>
              <input type="text" value={categoria_cnh} onChange = {(e) => setCategoriaCnh(e.target.value)} placeholder="Categoria CNH" required/>
            </div>
            <div className="form-group">
              <label>Vencimento CNH</label>
              <input type="text" value={vencimento_cnh} onChange = {(e) => setVencimentoCnh(e.target.value)} placeholder="Vencimento CNH" required/>
            </div>
          </div>
          <button className="submit-button">Cadastrar</button>
        </form>
      </div>
    </div>
  );
};

export default Cadastrar;
