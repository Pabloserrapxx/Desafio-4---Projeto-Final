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

            if (!cpf || !/^\d{11}$/.test(cpf)) {
                console.log(" Erro: CPF inválido (deve conter exatamente 11 números).");
                response.statusCode = 400;
                return response.end(JSON.stringify({ message: " O CPF deve conter exatamente 11 dígitos numéricos." }));
            }

            
            const dataNascimento = new Date(data_nascimento);
            const hoje = new Date();

            //  Calcula a idade
            let idade = hoje.getFullYear() - dataNascimento.getFullYear();
            const mesAtual = hoje.getMonth();
            const mesNascimento = dataNascimento.getMonth();
            const diaAtual = hoje.getDate();
            const diaNascimento = dataNascimento.getDate();

           
            if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
                idade--;
            }

            // 🚫 Se for menor de 18 anos, retorna um erro
            if (idade < 18) {
                response.statusCode = 400;
                response.setHeader('Content-Type', 'application/json');
                return response.end(JSON.stringify({ message: ' O motorista deve ter pelo menos 18 anos completos.' }));
            }

            

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
            const anoAtual = new Date().getFullYear();
            const placaRegex = /^[A-Z]{3}\d{4}$/; // Placa no formato XXX0000

            // Verifica se a placa já está cadastrada
            const placaQuery = 'SELECT * FROM veiculo WHERE placa = ?';
            conexão.query(placaQuery, [placa], (err, placaResult) => {
                if (err) {
                    console.error("Erro ao consultar placa:", err);
                    response.statusCode = 500;
                    return response.end(JSON.stringify({ message: 'Erro ao cadastrar veículo (consulta placa).' }));
                }

                if (placaResult.length > 0) {
                    console.log("Erro: Placa já cadastrada.");
                    response.statusCode = 400;
                    return response.end(JSON.stringify({ message: ' Placa já cadastrada.' }));
                }

                // Verifica se o CPF informado existe no banco
                const motoristaQuery = 'SELECT id_motorista FROM motorista WHERE cpf = ?';
                conexão.query(motoristaQuery, [cpf], (err, motoristaResult) => {
                    if (err) {
                        console.error("Erro ao consultar motorista:", err);
                        response.statusCode = 500;
                        return response.end(JSON.stringify({ message: 'Erro ao cadastrar veículo (consulta motorista).' }));
                    }

                    if (motoristaResult.length === 0) {
                        console.log("Erro: Motorista não encontrado.");
                        response.statusCode = 400;
                        return response.end(JSON.stringify({ message: 'Motorista não encontrado no sistema.' }));
                    }

                    const id_motorista = motoristaResult[0].id_motorista;

                    // Validação do ano do veículo
                    if (ano > anoAtual + 1) {
                        console.log("Erro: Ano do veículo inválido.");
                        response.statusCode = 400;
                        return response.end(JSON.stringify({ message: `O ano do veículo não pode ser maior que ${anoAtual + 1}.` }));
                    }

                    // Validação da placa
                    if (!placaRegex.test(placa)) {
                        console.log("Erro: Placa inválida (formato incorreto).");
                        response.statusCode = 400;
                        return response.end(JSON.stringify({ message: "A placa deve estar no formato XXX0000 (3 letras seguidas de 4 números)." }));
                    }

                    // Insere o veículo no banco de dados
                    const veiculoQuery = 'INSERT INTO veiculo (placa, ano, modelo, id_motorista) VALUES (?, ?, ?, ?)';
                    conexão.query(veiculoQuery, [placa, ano, modelo, id_motorista], (err) => {
                        if (err) {
                            console.error("Erro ao cadastrar veículo:", err);
                            response.statusCode = 500;
                            return response.end(JSON.stringify({ message: 'Erro ao cadastrar veículo.' }));
                        }

                        console.log("✅ Veículo cadastrado com sucesso!");
                        response.statusCode = 201;
                        response.end(JSON.stringify({ message: 'Veículo cadastrado com sucesso!' }));
                    });
                });
            });

        } catch (error) {
            console.error("Erro ao analisar JSON:", error);
            response.statusCode = 400;
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

            // Verifica se a data é válida
            const dataAtual = new Date();
            const dataInformada = new Date(data);
            if (isNaN(dataInformada.getTime()) || dataInformada > dataAtual) {
                response.statusCode = 400; // Bad Request
                response.setHeader('Content-Type', 'application/json');
                return response.end(JSON.stringify({ message: 'Não é possível cadastrar multas em datas futuras ao presente' }));
            }

            // Verifica se a placa existe no banco de dados
            const checkPlacaQuery = 'SELECT COUNT(*) AS count FROM veiculo WHERE placa = ?';
            conexão.query(checkPlacaQuery, [placa], (err, result) => {
                if (err) {
                    console.error("Erro ao verificar a placa:", err);
                    response.statusCode = 500; 
                    response.setHeader('Content-Type', 'application/json');
                    return response.end(JSON.stringify({ message: 'Erro ao verificar a placa.' }));
                }
                if (result[0].count === 0) {
                    response.statusCode = 400; 
                    response.setHeader('Content-Type', 'application/json');
                    return response.end(JSON.stringify({ message: ' A placa informada não está cadastrada.' }));
                }

                
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
            });
        } catch (error) {
            console.error("Erro ao analisar JSON:", error);
            response.statusCode = 400; 
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ message: 'Erro: Dados inválidos.' }));
        }
    });
}
