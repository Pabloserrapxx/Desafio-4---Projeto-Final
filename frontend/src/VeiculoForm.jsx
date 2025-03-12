import React, { useState, useEffect } from 'react';
import './VeiculoForm.css';

const VeiculoForm = () => {
    const [placa, setPlaca] = useState('');
    const [ano, setAno] = useState('');
    const [modelo, setModelo] = useState('');
    const [cpfMotorista, setCpfMotorista] = useState('');
    const [nomeMotoristaBusca, setNomeMotoristaBusca] = useState('');
    const [veiculosBusca, setVeiculosBusca] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [buscaAtiva, setBuscaAtiva] = useState(false); // Controla se a busca foi realizada

    const buscarTodosVeiculos = () => {
        setCarregando(true);
        setErro('');
        fetch("http://localhost:3333/veiculos")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setVeiculos(data);
                setCarregando(false);
            })
            .catch(error => {
                setErro(`Erro ao buscar veículos: ${error.message}`);
                setCarregando(false);
            });
    };

    useEffect(() => {
        buscarTodosVeiculos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const veiculoData = { placa, ano, modelo, cpf: cpfMotorista };

        try {
            const response = await fetch('http://localhost:3333/veiculos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(veiculoData),
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Erro ${response.status}`);
                } else {
                    throw new Error(`Erro ${response.status}: ${await response.text()}`);
                }
            }

            alert('Veículo cadastrado com sucesso!');
            setPlaca('');
            setAno('');
            setModelo('');
            setCpfMotorista('');
            buscarTodosVeiculos();
        } catch (error) {
            alert(`Erro ao cadastrar veículo: ${error.message}`);
        }
    };

    const handleBuscaVeiculos = async () => {
        if (!nomeMotoristaBusca) {
            alert("Por favor, digite o nome do motorista para buscar.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:3333/veiculos?nome=${nomeMotoristaBusca}`);

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Erro ${response.status}`);
                } else {
                    throw new Error(`Erro ${response.status}: ${await response.text()}`);
                }
            }

            const data = await response.json();
            setVeiculosBusca(data);
            setBuscaAtiva(true);
            setErro("");

            if (data.length === 0) {
                setErro("Motorista não cadastrado no site.");
            }

        } catch (error) {
            setVeiculosBusca([]);
            setBuscaAtiva(true);
            setErro(`Erro ao buscar veículos: ${error.message}`);
        }
    };

    return (
        <div className="veiculo-form-container">
             <h1>Gestão de Veículo</h1>
            {/* Formulário de Cadastro */}
            <div className="form-container">
                <h2>Cadastro de Veículo</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="placa">Placa:</label>
                        <input
                            type="text"
                            id="placa"
                            value={placa}
                            onChange={(e) => setPlaca(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="ano">Ano:</label>
                        <input
                            type="number"
                            id="ano"
                            value={ano}
                            onChange={(e) => setAno(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="modelo">Modelo:</label>
                        <input
                            type="text"
                            id="modelo"
                            value={modelo}
                            onChange={(e) => setModelo(e.target.value)}
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cpfMotorista">CPF do Motorista:</label>
                        <input
                            type="text"
                            id="cpfMotorista"
                            value={cpfMotorista}
                            onChange={(e) => setCpfMotorista(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="cadastrar-button">Cadastrar Veículo</button>
                </form>
            </div>

            {/* Consulta por Nome do Motorista */}
            <div className="consulta-lista-container">
                <h2>Consulta de Veículos por Nome do Motorista</h2>
                <div className="consulta-container">
                    <input
                        type="text"
                        id="nomeMotoristaBusca"
                        placeholder="Digite o nome do motorista para encontrar o veículo"
                        value={nomeMotoristaBusca}
                        onChange={(e) => setNomeMotoristaBusca(e.target.value)}
                        className="input-field"
                    />
                    <button type="button" onClick={handleBuscaVeiculos} className="search-button">
                        Buscar
                    </button>
                </div>

                {erro && <p className='erro-message'>{erro}</p>}
                {carregando && <p>Carregando...</p>}

                {/* Exibição dos Resultados da Busca */}
                {buscaAtiva && veiculosBusca.length > 0 && (
                    <div className="lista-veiculos">
                        <h3>Resultados da Busca:</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Placa</th>
                                    <th>Ano</th>
                                    <th>Modelo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {veiculosBusca.map((veiculo, index) => (
                                    <tr key={index}>
                                        <td>{veiculo.placa}</td>
                                        <td>{veiculo.ano}</td>
                                        <td>{veiculo.modelo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Exibição da Lista Completa SOMENTE quando não estiver buscando um motorista */}
                {!buscaAtiva && !carregando && veiculos.length > 0 && (
                    <div className='lista-veiculos'>
                        <h2>Lista de Veículos</h2>
                        <table>
                            <thead>
                                <tr>
                                    <th>Placa</th>
                                    <th>Ano</th>
                                    <th>Modelo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {veiculos.map((veiculo) => (
                                    <tr key={veiculo.placa}>
                                        <td>{veiculo.placa}</td>
                                        <td>{veiculo.ano}</td>
                                        <td>{veiculo.modelo}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VeiculoForm;
