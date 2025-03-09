import http from "node:http";
import mysql from "mysql2";
import cors from 'cors';

const conexão = mysql.createConnection({
    host: 'db', // Use 'db' (nome do serviço no docker-compose.yml)
    user: 'root',
    password: "Abacaxi741*",
    database: "Dentran"
});

conexão.connect(function (erro) {
    if (erro) throw erro;
    console.log("A conexão foi um sucesso");
});

const server = http.createServer((request, response) => {
    cors()(request, response, () => {
        const { method, url } = request;

        if (method === 'OPTIONS') {
            response.writeHead(204, {  // Usar writeHead para todos os headers
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS', // Incluir GET
                'Access-Control-Allow-Headers': 'Content-Type', // Adicionar outros headers permitidos, se necessário
            });
            response.end();
            return;
        }

        if (method === 'POST' && url === '/motoristas') {
            let body = '';
            request.on('data', chunk => {
                body += chunk;
            });

            request.on('end', () => {
                try {
                    const { nome, cpf, pontuacao, data_nascimento } = JSON.parse(body); // Nomes corretos das colunas
                    const query = 'INSERT INTO motorista (nome, cpf, pontuacao, data_nascimento) VALUES (?, ?, ?, ?)';
                    conexão.query(query, [nome, cpf, pontuacao, data_nascimento], (err, result) => {
                        if (err) {
                            console.error(err);
                            response.statusCode = 500;
                            return response.end('Erro ao cadastrar motorista');
                        }
                        response.statusCode = 201;
                        response.end('Motorista cadastrado com sucesso!');
                    });
                } catch (error) {
                    console.error("Erro ao analisar JSON:", error);
                    response.statusCode = 400;
                    response.end("Erro: Dados inválidos (motorista).");
                }
            });
        } else if (method === 'POST' && url === '/veiculos') {
            let body = '';
            request.on('data', chunk => {
                body += chunk;
            });
        
            request.on('end', () => {
                try {
                    const { placa, ano, modelo, cpf } = JSON.parse(body); // Receber o CPF
        
                    // 1. Consultar o ID do motorista pelo CPF
                    const motoristaQuery = 'SELECT id_motorista FROM motorista WHERE cpf = ?';
                    conexão.query(motoristaQuery, [cpf], (err, motoristaResult) => {
                        if (err) {
                            console.error("Erro ao consultar motorista:", err);
                            response.statusCode = 500;
                            return response.end('Erro ao cadastrar veículo (consulta motorista).');
                        }
        
                        // 2. Verificar se o motorista existe
                        if (motoristaResult.length === 0) {
                            response.statusCode = 400; // Bad Request
                            return response.end('Erro: Motorista não encontrado (CPF inválido).');
                        }
        
                        const id_motorista = motoristaResult[0].id_motorista;
        
                        // 3. Inserir o veículo com o ID do motorista
                        const veiculoQuery = 'INSERT INTO veiculo (placa, ano, modelo, id_motorista) VALUES (?, ?, ?, ?)';
                        conexão.query(veiculoQuery, [placa, ano, modelo, id_motorista], (err) => {
                            if (err) {
                                console.error(err);
                                response.statusCode = 500;
                                return response.end('Erro ao cadastrar veículo');
                            }
                            response.statusCode = 201;
                            response.end('Veículo cadastrado com sucesso!');
                        });
                    });
        
                } catch (error) {
                    console.error("Erro ao analisar JSON:", error);
                    response.statusCode = 400;
                    response.end("Erro: Dados inválidos (veículo).");
                }
            });
        
        } else if (method === 'POST' && url === '/multas') {
            let body = '';
            request.on('data', chunk => {
                body += chunk;
            });

            request.on('end', () => {
                try {
                    const { data, pontuacaoNaCarteira, valor, placa } = JSON.parse(body); // Nomes corretos
                    const query = 'INSERT INTO multa (data, pontuacaoNaCarteira, valor, placa) VALUES (?, ?, ?, ?)';
                    conexão.query(query, [data, pontuacaoNaCarteira, valor, placa], (err, result) => {
                        if (err) {
                            console.error("Erro ao inserir no banco de dados:", err);
                            response.statusCode = 500;
                            return response.end('Erro ao cadastrar multa');
                        }
                        console.log("Resultado da inserção:", result);
                        response.statusCode = 201;
                        response.end('Multa cadastrada com sucesso!');
                    });
                } catch (error) {
                    console.error("Erro ao analisar JSON:", error);
                    response.statusCode = 400;
                    response.end('Erro: Dados inválidos.');
                }
            });
        } else {
            response.statusCode = 404;
            response.end('Rota não encontrada');
        }
    });
});

server.listen(3333, () => {
    console.log('Servidor rodando na porta 3333');
});