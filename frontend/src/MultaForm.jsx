import React, { useState, useEffect } from 'react';
import './GestaoMultas.css'; // Importa o CSS

function GestaoMultas() {
    const [multas, setMultas] = useState([]);
    const [placaConsulta, setPlacaConsulta] = useState('');
    const [multaEncontrada, setMultaEncontrada] = useState(null); // Adicionado estado para multa encontrada
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);
    const [data, setData] = useState('');
    const [pontuacaoNaCarteira, setPontuacaoNaCarteira] = useState('');
    const [valor, setValor] = useState('');
    const [placa, setPlaca] = useState('');
    const [modoEdicao, setModoEdicao] = useState(false); // Modo de edição
    const [multaEditando, setMultaEditando] = useState(null); // Multa em edição

    // --- Funções de Busca (Consulta) ---
    const buscarTodasMultas = () => {
        setCarregando(true);
        setErro('');
        setMultaEncontrada(null); // Limpa multa encontrada
        setPlacaConsulta('');      // Limpa o campo de consulta

        fetch("http://localhost:3333/multas")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setMultas(data);
                setCarregando(false);
            })
            .catch(error => {
                setErro(`Erro ao buscar multas: ${error.message}`);
                setCarregando(false);
            });
    };

    const buscarPorPlaca = () => {
        setCarregando(true);
        setErro('');
        setMultas([]);  // Limpa a lista de multas *antes* da busca

        fetch(`http://localhost:3333/multas?placa=${placaConsulta}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // Verifica se a resposta é um array vazio ou um array com dados
                if (Array.isArray(data) && data.length > 0) {
                  setMultaEncontrada(data);
                } else {
                  setMultaEncontrada([]); // Define como array vazio se não houver multas
                }
                setErro('');
                setCarregando(false);
            })
            .catch(error => {
                setErro(`Erro ao buscar multas por placa: ${error.message}`);
                setCarregando(false);
                setMultaEncontrada(null); // Limpa em caso de erro
            });
    };

    useEffect(() => {
        buscarTodasMultas();
    }, []);

    // --- Funções de Cadastro/Edição ---
    const handleSubmit = async (e) => {
        e.preventDefault();

        const multaData = { data, pontuacaoNaCarteira, valor, placa };

        const url = modoEdicao
            ? `http://localhost:3333/multas/${multaEditando.id_multa}`
            : 'http://localhost:3333/multas';
        const method = modoEdicao ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(multaData),
        });

        if (response.ok) {
            const mensagem = modoEdicao ? 'Multa atualizada com sucesso!' : 'Multa cadastrada com sucesso!';
            alert(mensagem);
            limparFormulario();
            buscarTodasMultas();
            setModoEdicao(false);
            setMultaEditando(null);
        } else {
            const errorData = await response.json();
            alert(`Erro: ${errorData.message || 'Erro desconhecido'}`);
        }
    };

    const limparFormulario = () => {
        setData('');
        setPontuacaoNaCarteira('');
        setValor('');
        setPlaca('');
    };

    return (
        <div className="gestao-multas-container">
            <h1>Gestão de Multas</h1>

            {/* Formulário de Cadastro/Edição */}
            <div className="form-container">
                <h2>{modoEdicao ? 'Editar Multa' : 'Cadastrar Multa'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="data">Data e Hora:</label>
                        <input
                            type="datetime-local"
                            id="data"
                            value={data}
                            onChange={(e) => setData(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="placa">Placa:</label>
                        <input
                            type="text"
                            id="placa"
                            value={placa}
                            onChange={(e) => setPlaca(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="valor">Valor:</label>
                        <input
                            type="number"
                            step="0.01"
                            id="valor"
                            value={valor}
                            onChange={(e) => setValor(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="pontuacao">Pontuação:</label>
                        <input
                            type="number"
                            id="pontuacao"
                            value={pontuacaoNaCarteira}
                            onChange={(e) => setPontuacaoNaCarteira(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="cadastrar-button">
                        {modoEdicao ? 'Salvar Alterações' : 'Cadastrar Multa'}
                    </button>
                </form>
            </div>

            {/* Consulta e Lista */}
            <div className="consulta-lista-container">
                <h2>Lista de Multas</h2>
                <div className="consulta-container">
                    <input
                        type="text"
                        value={placaConsulta}
                        onChange={(e) => setPlacaConsulta(e.target.value)}
                        placeholder="Digite a placa do veículo para buscar a multa"
                        disabled={carregando}
                    />
                    <button onClick={buscarPorPlaca} disabled={carregando} className="search-button">
                        {carregando ? '...' :  'Buscar'}
                    </button>
                </div>

                {erro && <p className="erro-message">{erro}</p>}

                {/* Exibição dos resultados */}
                {carregando && <p>Carregando...</p>}

                {!carregando && multaEncontrada !== null && multaEncontrada.length > 0 && (
                    <div className="lista-multas">
                        <h3>Multas Encontradas</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Data</th>
                                    <th>Placa</th>
                                    <th>Pontuação</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {multaEncontrada.map(multa => (
                                    <tr key={multa.id_multa}>
                                        <td>{multa.id_multa}</td>
                                        <td>{new Date(multa.data).toLocaleString()}</td>
                                        <td>{multa.placa}</td>
                                        <td>{multa.pontuacaoNaCarteira}</td>
                                        <td>{multa.valor}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

               {!carregando && multaEncontrada !== null && multaEncontrada.length === 0 && (
                    <p>Nenhuma multa encontrada para a placa informada.</p>
                )}


                {!carregando && multas.length > 0 && (
                    <div className="lista-multas">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Data</th>
                                    <th>Placa</th>
                                    <th>Pontuação</th>
                                    <th>Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {multas.map(multa => (
                                    <tr key={multa.id_multa}>
                                        <td>{multa.id_multa}</td>
                                        <td>{new Date(multa.data).toLocaleString()}</td>
                                        <td>{multa.placa}</td>
                                        <td>{multa.pontuacaoNaCarteira}</td>
                                        <td>{multa.valor}</td>
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

export default GestaoMultas;