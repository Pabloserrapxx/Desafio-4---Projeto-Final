import React, { useState } from 'react';

const MultaForm = () => {
    const [data, setData] = useState(''); // Campo data
    const [pontuacaoNaCarteira, setPontuacaoNaCarteira] = useState(''); // Campo pontuacaoNaCarteira
    const [valor, setValor] = useState('');
    const [placa, setPlaca] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const multaData = { data, pontuacaoNaCarteira, valor, placa };

        const response = await fetch('http://localhost:3333/multas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(multaData),
        });

        if (response.ok) {
            alert('Multa cadastrada com sucesso!');
            setData('');
            setPontuacaoNaCarteira('');
            setValor('');
            setPlaca('');
        } else {
            const errorData = await response.json(); // Obter detalhes do erro
            alert(`Erro ao cadastrar multa: ${errorData.message || 'Erro desconhecido'}`);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <h2>Cadastro de Multa</h2>

             <label>
                Data e Hora:
                <input
                    type="datetime-local"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    required
                />
            </label>
            <br />

            <label>
                Placa:
                <input
                    type="text"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value)}
                    required
                />
            </label>
            <br />

             <label>
                Valor:
                <input
                    type="number"
                    step="0.01"
                    value={valor}
                    onChange={(e) => setValor(e.target.value)}
                    required
                />
            </label>
            <br />

            <label>
                Pontuação na carteira:
                <input
                    type="number"
                    value={pontuacaoNaCarteira}
                    onChange={(e) => setPontuacaoNaCarteira(e.target.value)}
                    required
                />
            </label>
            <br />
            <button type="submit">Cadastrar Multa</button>
        </form>
    );
};

export default MultaForm;