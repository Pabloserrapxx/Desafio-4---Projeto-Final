import React, { useState } from 'react';

function ConsultaGeral() {
    const [veiculos, setVeiculos] = useState([]);
    const [multas, setMultas] = useState([]);
    const [motoristas, setMotoristas] = useState([]);
    const [nomeMotoristaConsulta, setNomeMotoristaConsulta] = useState('');
    const [placaConsultaMulta, setPlacaConsultaMulta] = useState('');  // Só placa para multa
    const [tipoConsulta, setTipoConsulta] = useState('');
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    const fetchData = async (url) => {
        setCarregando(true);
        setErro('');
        try {
            const response = await fetch(url);
            if (!response.ok) {
                const errorData = await response.json();
                const errorMessage = errorData.message || `Erro HTTP: ${response.status}`;
                throw new Error(errorMessage);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            setErro(`Erro: ${error.message}`);
            console.error(error);
            return [];
        } finally {
            setCarregando(false);
        }
    };

    const buscarVeiculosPorNomeMotorista = async () => {
        setTipoConsulta('veiculosPorMotorista');
        const data = await fetchData(`http://localhost:3333/motoristas?nome=${nomeMotoristaConsulta}`);
        setVeiculos(data);
        setMultas([]);
        setMotoristas([]);
    };

  // Simplifiquei, removendo busca por placa *separada* para veículos.  Usa-se a mesma placa para multas.
  // Se você *realmente* precisar de buscas separadas, mantenha os dois estados e funções, como antes.

    const buscarTodasMultas = async () => {
        setTipoConsulta('todasMultas');
        const data = await fetchData('http://localhost:3333/multas');
        setMultas(data);
        setVeiculos([]);
        setMotoristas([]);
    };

    const buscarMultasPorPlaca = async () => {
        setTipoConsulta('multasPorPlaca');
        const data = await fetchData(`http://localhost:3333/multas?placa=${placaConsultaMulta}`);
        setMultas(data);
        setVeiculos([]);
        setMotoristas([]);
    };

    const buscarMotoristasComPontuacao = async () => {
        setTipoConsulta('motoristasComPontuacao');
        const data = await fetchData('http://localhost:3333/motoristas?pontuacao=10');
        setMotoristas(data);
        setVeiculos([]);
        setMultas([]);
    };

    return (
        <div>
            <h2>Consultas Gerais</h2>

            <div>
                {/* Consultas de Veículos */}
                <input
                    type="text"
                    value={nomeMotoristaConsulta}
                    onChange={(e) => setNomeMotoristaConsulta(e.target.value)}
                    placeholder="Nome do Motorista"
                    disabled={carregando}
                />
                <button onClick={buscarVeiculosPorNomeMotorista} disabled={carregando}>
                    {carregando && tipoConsulta === 'veiculosPorMotorista' ? 'Carregando...' : 'Veículos por Motorista'}
                </button>

                {/* Consultas de Multas */}
                <button onClick={buscarTodasMultas} disabled={carregando}>
                    {carregando && tipoConsulta === 'todasMultas' ? 'Carregando...' : 'Todas Multas'}
                </button>

                <input
                    type="text"
                    value={placaConsultaMulta}
                    onChange={(e) => setPlacaConsultaMulta(e.target.value)}
                    placeholder="Placa da Multa"
                    disabled={carregando}
                />
                <button onClick={buscarMultasPorPlaca} disabled={carregando}>
                    {carregando && tipoConsulta === 'multasPorPlaca' ? 'Carregando...' : 'Multas por Placa'}
                </button>

                {/* Consulta de Motoristas com Pontuação */}
                <button onClick={buscarMotoristasComPontuacao} disabled={carregando}>
                    {carregando && tipoConsulta === 'motoristasComPontuacao' ? 'Carregando...' : 'Motoristas com Pontuação >= 10'}
                </button>
            </div>

            {erro && <p style={{ color: 'red' }}>{erro}</p>}
            {carregando && <p>Carregando...</p>}

            {/* Exibição dos Veículos por Nome do Motorista */}
            {!carregando && tipoConsulta === 'veiculosPorMotorista' && veiculos.length > 0 && (
                <div>
                    <h3>Veículos do Motorista (Nome: {nomeMotoristaConsulta})</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Placa</th>
                                <th>Ano</th>
                                <th>Modelo</th>
                                <th>ID do Motorista</th>
                            </tr>
                        </thead>
                        <tbody>
                            {veiculos.map(veiculo => (
                                <tr key={veiculo.placa}>
                                    <td>{veiculo.placa}</td>
                                    <td>{veiculo.ano}</td>
                                    <td>{veiculo.modelo}</td>
                                    <td>{veiculo.id_motorista}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {!carregando && tipoConsulta === 'veiculosPorMotorista' && veiculos.length === 0 && nomeMotoristaConsulta && (
                <p>Nenhum veículo encontrado para o motorista {nomeMotoristaConsulta}.</p>
            )}



            {/* Exibição de Todas as Multas */}
            {!carregando && tipoConsulta === 'todasMultas' && multas.length > 0 && (
                <div>
                    <h3>Lista de Multas</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Data</th>
                                <th>Placa</th>
                                <th>Pontuação na Carteira</th>
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
            {/* Exibição das Multas por Placa */}
            {!carregando && tipoConsulta === 'multasPorPlaca' && multas.length > 0 && (
                <div>
                    <h3>Multas da Placa: {placaConsultaMulta}</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Data</th>
                                <th>Placa</th>
                                 <th>Pontuação na Carteira</th>
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
             {!carregando && tipoConsulta === 'multasPorPlaca' && multas.length === 0 && placaConsultaMulta && (
                <p>Nenhuma multa encontrada para a placa {placaConsultaMulta}.</p>
            )}

            {/* Exibição dos Motoristas (por pontuação) */}
            {!carregando && tipoConsulta === 'motoristasComPontuacao' && motoristas.length > 0 && (
                <div>
                    <h3>Motoristas com Pontuação ≥ 10</h3>
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
    );
}

export default ConsultaGeral;