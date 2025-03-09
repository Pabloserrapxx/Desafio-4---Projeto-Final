import React, { useState } from 'react';

const MotoristaForm = () => {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [pontuacao, setPontuacao] = useState(''); // Campo pontuacao
    const [data_nascimento, setDataNascimento] = useState(''); // Campo data_nascimento

    const handleSubmit = async (e) => {
        e.preventDefault();

        const motoristaData = { nome, cpf, pontuacao, data_nascimento };

        const response = await fetch('http://localhost:3333/motoristas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(motoristaData),
        });

        if (response.ok) {
            alert('Motorista cadastrado com sucesso!');
            setNome('');
            setCpf('');
            setPontuacao('');
            setDataNascimento('');
        } else {
            const errorData = await response.json(); // Obter detalhes do erro
            alert(`Erro ao cadastrar motorista: ${errorData.message || 'Erro desconhecido'}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Cadastro de Motorista</h2>
            <label>
                Nome:
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
            </label><br />
            <label>
                CPF:
                <input type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} required />
            </label><br />
            <label>
                Pontuação:
                <input type="number" value={pontuacao} onChange={(e) => setPontuacao(e.target.value)} />
            </label><br />
            <label>
                Data de Nascimento:
                <input type="date" value={data_nascimento} onChange={(e) => setDataNascimento(e.target.value)} />
            </label><br />
            <button type="submit">Cadastrar Motorista</button>
        </form>
    );
};

export default MotoristaForm;