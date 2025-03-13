import React, { useState, useEffect } from 'react';

function ConsultaMotoristas() {
    const [motoristas, setMotoristas] = useState([]);
    const [cpfConsulta, setCpfConsulta] = useState('');
    const [motoristaEncontrado, setMotoristaEncontrado] = useState(null);
    const [erro, setErro] = useState('');
    const [carregando, setCarregando] = useState(false);

    // Função para buscar todos os motoristas
    const buscarTodosMotoristas = () => {
        setCarregando(true);
        setErro('');
        setMotoristaEncontrado(null); // Limpa motorista encontrado
        setCpfConsulta(''); // Limpa campo de CPF

        fetch("http://localhost:3333/motoristas") // Sem /api
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

    // Função para buscar motorista por CPF
    const buscarPorCpf = () => {
        setCarregando(true);
        setErro('');
        setMotoristas([]); //limpa a lista

        fetch(`http://localhost:3333/motoristas?cpf=${cpfConsulta}`) // Sem /api
            .then(response => {
                if (!response.ok) { // Verifica QUALQUER erro, não apenas 404
                   throw new Error(`Erro HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setMotoristaEncontrado(data); // Salva os dados diretamente, sempre um array
                setErro(''); // Limpa mensagens de erro anteriores
                setCarregando(false);
            })
            .catch(error => {
                setErro(`Erro ao buscar motorista: ${error.message}`);
                setCarregando(false);
                setMotoristaEncontrado(null); // Limpa em caso de erro
            });
    };

    // useEffect para buscar todos os motoristas ao montar o componente (opcional)
    useEffect(() => {
        buscarTodosMotoristas();
    }, []);

    return (
        <div>
            <h2>Consulta de Motoristas</h2>

            {/* Buscar Todos */}
            <button onClick={buscarTodosMotoristas} disabled={carregando}>
                {carregando ? 'Carregando...' : 'Buscar Todos os Motoristas'}
            </button>

            {/* Buscar por CPF */}
            <div>
                <label htmlFor="cpf">Buscar por CPF:</label>
                <input
                    type="text"
                    id="cpf"
                    value={cpfConsulta}
                    onChange={(e) => setCpfConsulta(e.target.value)}
                    placeholder="Digite o CPF"
                    disabled={carregando}
                />
                <button onClick={buscarPorCpf} disabled={carregando}>
                    {carregando ? 'Carregando...' : 'Buscar'}
                </button>
            </div>

            {/* Exibição de erros */}
            {erro && <p style={{ color: 'red' }}>{erro}</p>}

            {/* Exibição dos resultados */}
            {carregando && <p>Carregando...</p>}

            {!carregando && motoristas.length > 0 && (
                <div>
                    <h3>Lista de Motoristas</h3>
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

            {!carregando && motoristaEncontrado && motoristaEncontrado.length > 0 && (
                <div>
                    <h3>Motorista Encontrado</h3>
                    {motoristaEncontrado.map((motorista) => (  // <-- Agora itera sobre um array
                        <div key={motorista.id_motorista}>
                            <p>ID: {motorista.id_motorista}</p>
                            <p>Nome: {motorista.nome}</p>
                            <p>CPF: {motorista.cpf}</p>
                            <p>Pontuação: {motorista.pontuacao}</p>
                            <p>Data de Nascimento: {motorista.data_nascimento ? new Date(motorista.data_nascimento).toLocaleDateString() : ''}</p>
                        </div>
                    ))}
                </div>
            )}

            {!carregando && motoristaEncontrado === null && cpfConsulta !== '' && motoristas.length === 0 && <p>Nenhum motorista encontrado para o CPF informado.</p>}
        </div>
    );
}

export default ConsultaMotoristas;