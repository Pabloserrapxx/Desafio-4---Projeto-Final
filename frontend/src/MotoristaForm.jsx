// frontend/src/components/MotoristaForm.jsx
import React, { useState, useEffect } from 'react';
import './MotoristaForm.css'; // Importe o CSS

function GestaoMotoristas() {
    const [motoristas, setMotoristas] = useState([]);
    const [cpfConsulta, setCpfConsulta] = useState('');
    const [motoristaEncontrado, setMotoristaEncontrado] = useState(null);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [data_nascimento, setDataNascimento] = useState('');
    const [modoEdicao, setModoEdicao] = useState(false); // Modo de edição
    const [motoristaEditando, setMotoristaEditando] = useState(null); // Motorista em edição

    // --- Funções de Busca (Consulta) ---
    const buscarTodosMotoristas = () => {
        setCarregando(true);
        setErro('');
        setMotoristaEncontrado(null);
        setCpfConsulta('');

        fetch("http://localhost:3333/motoristas")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setMotoristas(data);
                setCarregando(false);
            })
            .catch(error => {
                setErro(`Erro ao buscar motoristas: ${error.message}`);
                setCarregando(false);
            });
    };

    const buscarPorCpf = () => {
        setCarregando(true);
        setErro('');
        setMotoristas([]); // Limpa a lista geral de motoristas

        fetch(`http://localhost:3333/motoristas?cpf=${cpfConsulta}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Handle the array response
                if (Array.isArray(data)) {
                    setMotoristaEncontrado(data);  // Store as an array
                } else {
                    // Handle unexpected non-array response
                    setMotoristaEncontrado([]); // Or set to null
                    console.error("Expected an array, but received:", data);
                }
                setErro('');
                setCarregando(false);
            })
            .catch(error => {
                setErro(`Erro ao buscar motorista: ${error.message}`);
                setCarregando(false);
                setMotoristaEncontrado(null);
            });
    };

    useEffect(() => {
        buscarTodosMotoristas();
    }, []);



    // --- Funções de Cadastro/Edição ---

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (modoEdicao && !motoristaEditando) {
            alert('Nenhum motorista selecionado para edição.');
            return;
        }

        const motoristaData = { nome, cpf, data_nascimento };
        const url = modoEdicao
            ? `http://localhost:3333/motoristas/${motoristaEditando.id_motorista}`
            : 'http://localhost:3333/motoristas';
        const method = modoEdicao ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(motoristaData),
            });

            if (!response.ok) {
               
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Erro ${response.status}`);
                } else {
                  
                    throw new Error(`Erro ${response.status}: ${await response.text()}`);
                }
            }

            alert(modoEdicao ? 'Motorista atualizado com sucesso!' : 'Motorista cadastrado com sucesso!');
            limparFormulario();
            buscarTodosMotoristas();
            setModoEdicao(false);
            setMotoristaEditando(null);
        } catch (error) {
            alert(`Erro ao salvar: ${error.message}`);
        }
    };

    const limparFormulario = () => {
        setNome('');
        setCpf('');
        setDataNascimento('');
    }


    return (
        <div className="gestao-motoristas-container">
            <h1>Gestão de Motoristas</h1>

            {/* Formulário de Cadastro/Edição */}
            <div className="form-container">
                <h2>{modoEdicao ? 'Editar Motorista' : 'Cadastrar Motorista'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nome">Nome:</label>
                        <input
                            type="text"
                            id="nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="cpf">CPF:</label>
                        <input
                            type="text"
                            id="cpf"
                            value={cpf}
                            onChange={(e) => setCpf(e.target.value)}
                            required
                             className="input-field"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="data_nascimento">Data de Nascimento:</label>
                        <input
                            type="date"
                            id="data_nascimento"
                            value={data_nascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}
                             className="input-field"
                        />
                    </div>
                    <button type="submit" className="cadastrar-button">
                        {modoEdicao ? 'Salvar Alterações' : 'Cadastrar Motorista'}
                    </button>
                </form>
            </div>


            {/* Consulta e Lista */}
            <div className="consulta-lista-container">
                <h2>Lista de Motoristas</h2>
                <div className="consulta-container">

                    <input
                        type="text"
                        value={cpfConsulta}
                        onChange={(e) => setCpfConsulta(e.target.value)}
                        placeholder="Digite o CPF para buscar"
                        disabled={carregando}
                         className="input-field"
                    />
                    <button onClick={buscarPorCpf} disabled={carregando} className="search-button">
                        {carregando ? '...' : 'buscar'}
                    </button>
                </div>

                {erro && <p className="erro-message">{erro}</p>}

                {/* Exibição dos resultados */}
                {carregando && <p>Carregando...</p>}

                 {!carregando && motoristaEncontrado && motoristaEncontrado.length > 0 && (
                    <div className="lista-motoristas">
                        <h3>Motorista Encontrado</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>Pontuação</th>
                                    <th>Data de Nascimento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {motoristaEncontrado.map((motorista) => (
                                    <tr key={motorista.id_motorista}>
                                        <td>{motorista.id_motorista}</td>
                                        <td>{motorista.nome}</td>
                                        <td>{motorista.cpf}</td>
                                        <td>{motorista.pontuacao}</td>
                                        <td>{motorista.data_nascimento ? new Date(motorista.data_nascimento).toLocaleDateString() : ''}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!carregando && motoristaEncontrado === null && cpfConsulta !== '' && motoristas.length === 0 && (
                    <p>Nenhum motorista encontrado para o CPF informado.</p>
                )}


                {!carregando && motoristas.length > 0 && (
                    <div className="lista-motoristas">

                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>Pontuação</th>
                                      <th>Data de Nascimento</th>
                                     
                                </tr>
                            </thead>
                            <tbody>
                                {motoristas.map(motorista => (
                                    <tr key={motorista.id_motorista}>
                                        <td>{motorista.id_motorista}</td>
                                        <td>{motorista.nome}</td>
                                        <td>{motorista.cpf}</td>
                                         <td>{motorista.pontuacao}</td>
                                       <td>{motorista.data_nascimento ? new Date(motorista.data_nascimento).toLocaleDateString() : ''}</td>
                                         
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GestaoMotoristas;