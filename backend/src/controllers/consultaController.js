import { conexão } from '../db.js'; // Importa a conexão

// Função para buscar todos os motoristas
export function handleGetAllMotoristas(request, response) {
    const query = 'SELECT * FROM motorista';
    conexão.query(query, (err, results) => {
        if (err) {
            console.error(err);
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json'); // Define o header aqui também
            return response.end(JSON.stringify({ message: 'Erro ao consultar motoristas' }));
        }
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(results));
    });
}

// Função para buscar motorista por CPF
export function handleGetMotoristaByCPF(request, response, cpf) {
    const query = 'SELECT * FROM motorista WHERE cpf = ?';
    conexão.query(query, [cpf], (err, results) => {
        if (err) {
            console.error(err);
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json'); // Define o header aqui também
            return response.end(JSON.stringify({ message: 'Erro ao consultar motorista' }));
        }

        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(results)); // Sempre retorna um array
    });
}
// Consulta Veículos por NOME do Motorista
export function handleGetVeiculosByNomeMotorista(request, response, nomeMotorista) {
    const query = `
        SELECT v.*
        FROM veiculo v
        JOIN motorista m ON v.id_motorista = m.id_motorista
        WHERE m.nome LIKE ?;
    `;
    conexão.query(query, [`%${nomeMotorista}%`], (err, results) => {
        if (err) {
            console.error("Erro ao consultar veículos por nome do motorista:", err);
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json');
            return response.end(JSON.stringify({ message: 'Erro ao consultar veículos' }));
        }
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(results));
    });
}

// Consulta Veículo por Placa
export function handleGetVeiculoByPlaca(request, response, placa) {
    const query = 'SELECT * FROM veiculo WHERE placa = ?';
    conexão.query(query, [placa], (err, results) => {
        if (err) {
            console.error("Erro ao consultar veículo por placa:", err);
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json');
            return response.end(JSON.stringify({ message: 'Erro ao consultar veículo' }));
        }
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(results));
    });
}

// --- Funções relacionadas a Multas ---
//Buscar todas as multas
export function handleGetAllMultas(request, response) {
    const query = 'SELECT * FROM multa';
    conexão.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao consultar multas:", err);
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json');
            return response.end(JSON.stringify({ message: 'Erro ao consultar multas.' }));
        }
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(results));
    })
}

//Busca por placa
export function handleGetMultasByPlaca(request, response, placa) {
    const query = 'SELECT * FROM multa WHERE placa = ?';
    conexão.query(query, [placa], (err, results) => {
        if (err) {
            console.error("Erro ao consultar multas por placa:", err);
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json');
            return response.end(JSON.stringify({ message: 'Erro ao consultar multas por placa.' }));
        }
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(results));
    });
}
export function handleGetMotoristasComPontuacao(request, response) {
    const query = 'SELECT * FROM motorista WHERE pontuacao >= 10'; // Consulta SQL
    conexão.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao consultar motoristas por pontuação:", err);
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json');
            return response.end(JSON.stringify({ message: 'Erro ao consultar motoristas por pontuação.' }));
        }
        response.statusCode = 200;
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify(results));
    });
}

export function handleDeleteMotorista(request, response, id) {
    const query = 'DELETE FROM motorista WHERE id_motorista = ?';
    conexão.query(query, [id], (err, result) => {
        if (err) {
            console.error("Erro ao excluir motorista:", err);
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ message: 'Erro ao excluir motorista' }));
            return;
        }

        if (result.affectedRows === 0) {
            response.statusCode = 404; // 404 Not Found
             response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({ message: 'Motorista não encontrado' }));
            return;
        }

        response.statusCode = 200; // 200 OK
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({ message: 'Motorista excluído com sucesso' }));
    });
}

export function handleUpdateMotorista(request, response, id, data){
    const {nome, cpf, data_nascimento} = data;
    const query = 'UPDATE motorista SET nome = ?, cpf = ?, data_nascimento = ? WHERE id_motorista = ?';
    conexão.query(query, [nome, cpf, data_nascimento, id], (err, result) => {
        if(err){
            console.error("Erro ao atualizar Motorista", err);
            response.statusCode = 500;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({message: "Erro ao atualizar motorista"}))
            return;
        }

        if(result.affectedRows === 0){
            response.statusCode = 404; // 404 Not Found
             response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify({message: "Motorista não encontrado"}));
            return;
        }

        response.statusCode = 200; // 200 OK
        response.setHeader('Content-Type', 'application/json');
        response.end(JSON.stringify({message: "Motorista atualizado com sucesso!"}));
    })
}   

export function handleGetAllVeiculos(request, response) {
    const query = 'SELECT * FROM veiculo';
    conexão.query(query, (err, results) => {
        if (err) {
            console.error("Erro ao consultar todos os veículos:", err);
            response.statusCode = 500; // Correct: Use statusCode
            response.setHeader('Content-Type', 'application/json'); // Correct: Set header
            response.end(JSON.stringify({ message: 'Erro ao consultar veículos' })); //Correct
            return;
        }
        response.statusCode = 200; // Correct: Use statusCode
        response.setHeader('Content-Type', 'application/json'); // Correct: Set header
        response.end(JSON.stringify(results)); // Correct: Send JSON and end response
    });
}



