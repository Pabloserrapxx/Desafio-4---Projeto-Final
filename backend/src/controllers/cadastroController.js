import { conexão } from '../db.js';

export function handleCadastroMotorista(request, response) {
    let body = '';
    request.on('data', chunk => {
        body += chunk;
    });

    request.on('end', () => {
        try {
            const { nome, cpf, data_nascimento } = JSON.parse(body); // Não inclui mais 'pontuacao'
            const pontuacao = 0; // Define a pontuação como 0

            // A query SQL AGORA inclui a pontuacao, mas com um valor fixo (0)
            const query = 'INSERT INTO motorista (nome, cpf, pontuacao, data_nascimento) VALUES (?, ?, ?, ?)';
            conexão.query(query, [nome, cpf, pontuacao, data_nascimento], (err, result) => { // Passa o valor 0
                if (err) {
                    console.error(err);
                    response.statusCode = 500;
                    response.setHeader('Content-Type', 'application/json');
                    return response.end(JSON.stringify({ message: 'Erro ao cadastrar motorista' }));
                }
                response.statusCode = 201;
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify({ message: 'Motorista cadastrado com sucesso!' }));
            });
        } catch (error) {
            console.error("Erro ao analisar JSON:", error);
            response.statusCode = 400;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ message: "Erro: Dados inválidos (motorista)." }));
        }
    });
}
export function handleCadastroVeiculo(request, response) {
    let body = '';
    request.on('data', chunk => {
        body += chunk;
    });

    request.on('end', () => {
        try {
            const { placa, ano, modelo, cpf } = JSON.parse(body);

            const motoristaQuery = 'SELECT id_motorista FROM motorista WHERE cpf = ?';
            conexão.query(motoristaQuery, [cpf], (err, motoristaResult) => {
                if (err) {
                    console.error("Erro ao consultar motorista:", err);
                    response.statusCode = 500;
                    response.setHeader('Content-Type', 'application/json');
                    return response.end(JSON.stringify({ message: 'Erro ao cadastrar veículo (consulta motorista).' }));
                }

                if (motoristaResult.length === 0) {
                    response.statusCode = 400;
                    response.setHeader('Content-Type', 'application/json');
                    return response.end(JSON.stringify({ message: 'Erro: Motorista não encontrado (CPF inválido).' }));
                }

                const id_motorista = motoristaResult[0].id_motorista;

                const veiculoQuery = 'INSERT INTO veiculo (placa, ano, modelo, id_motorista) VALUES (?, ?, ?, ?)';
                conexão.query(veiculoQuery, [placa, ano, modelo, id_motorista], (err) => {
                    if (err) {
                        console.error(err);
                        response.statusCode = 500;
                        response.setHeader('Content-Type', 'application/json');
                        return response.end(JSON.stringify({ message: 'Erro ao cadastrar veículo' }));
                    }
                    response.statusCode = 201;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify({ message: 'Veículo cadastrado com sucesso!' }));
                });
            });

        } catch (error) {
            console.error("Erro ao analisar JSON:", error);
            response.statusCode = 400;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ message: "Erro: Dados inválidos (veículo)." }));
        }
    });
}

export function handleCadastroMulta(request, response) {
    let body = '';
    request.on('data', chunk => {
        body += chunk;
    });

    request.on('end', () => {
        try {
            const { data, pontuacaoNaCarteira, valor, placa } = JSON.parse(body);
            const query = 'INSERT INTO multa (data, pontuacaoNaCarteira, valor, placa) VALUES (?, ?, ?, ?)';
            conexão.query(query, [data, pontuacaoNaCarteira, valor, placa], (err, result) => {
                if (err) {
                    console.error("Erro ao inserir no banco de dados:", err);
                    response.statusCode = 500;
                    response.setHeader('Content-Type', 'application/json');
                    return response.end(JSON.stringify({ message: 'Erro ao cadastrar multa' }));
                }
                console.log("Resultado da inserção:", result);
                response.statusCode = 201;
                response.setHeader('Content-Type', 'application/json');
                response.end(JSON.stringify({ message: 'Multa cadastrada com sucesso!' }));
            });
        } catch (error) {
            console.error("Erro ao analisar JSON:", error);
            response.statusCode = 400;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ message: 'Erro: Dados inválidos.' }));
        }
    });
}