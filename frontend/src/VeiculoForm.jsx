import React, { useState } from 'react';

const VeiculoForm = () => {
    const [placa, setPlaca] = useState('');
    const [ano, setAno] = useState('');
    const [modelo, setModelo] = useState('');
    const [cpfMotorista, setCpfMotorista] = useState(''); // Usar CPF, não ID

    const handleSubmit = async (e) => {
        e.preventDefault();
        const veiculoData = { placa, ano, modelo, cpf: cpfMotorista }; // Enviar o CPF

        const response = await fetch('http://localhost:3333/veiculos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(veiculoData),
        });

        if (response.ok) {
            alert('Veículo cadastrado com sucesso!');
            setPlaca('');
            setAno('');
            setModelo('');
            setCpfMotorista(''); // Limpar o campo CPF
        } else {
            const errorData = await response.json();
            alert(`Erro ao cadastrar veículo: ${errorData.message || 'Erro desconhecido'}`);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Cadastro de Veículo</h2>
            <label>Placa: <input type="text" value={placa} onChange={(e) => setPlaca(e.target.value)} required /></label><br />
            <label>Ano: <input type="number" value={ano} onChange={(e) => setAno(e.target.value)} /></label><br />
            <label>Modelo: <input type="text" value={modelo} onChange={(e) => setModelo(e.target.value)} /></label><br />
            <label>
                CPF do Motorista:
                <input
                    type="text"
                    value={cpfMotorista}
                    onChange={(e) => setCpfMotorista(e.target.value)}
                    required
                />
            </label><br />
            <button type="submit">Cadastrar Veículo</button>
        </form>
    );
};

export default VeiculoForm;