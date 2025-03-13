// backend/server.js
import http from "node:http";
import cors from 'cors';
import {
    handleGetAllMotoristas, // <--- Verifique se o nome está correto aqui
    handleGetMotoristaByCPF,
    handleGetVeiculosByNomeMotorista,
    handleGetVeiculoByPlaca,
    handleGetAllMultas,
    handleGetMultasByPlaca,
    handleGetMotoristasComPontuacao,
    handleGetAllVeiculos,
    handleDeleteMotorista, // Import the new handler
    handleUpdateMotorista

} from './controllers/consultaController.js'; // Caminho relativo correto
import {
    handleCadastroMotorista,
    handleCadastroVeiculo,
    handleCadastroMulta,
   
} from './controllers/cadastroController.js'; // Import from cadastroController

const server = http.createServer((request, response) => {
    cors()(request, response, () => {
        const { method, url: requestUrl } = request;
        const parsedUrl = new URL(requestUrl, `http://${request.headers.host}`);
        const pathname = parsedUrl.pathname;

        // OPTIONS (Preflight) - Correct, leave as is
        if (method === 'OPTIONS') {
            response.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, DELETE, PUT', // Add DELETE and PUT
                'Access-Control-Allow-Headers': 'Content-Type',
            });
            response.end();
            return;
        }

        // --- Cadastro (POST) --- Correct, leave as is
        if (method === 'POST' && pathname === '/motoristas') {
            handleCadastroMotorista(request, response);
        } else if (method === 'POST' && pathname === '/veiculos') {
            handleCadastroVeiculo(request, response);
        } else if (method === 'POST' && pathname === '/multas') {
            handleCadastroMulta(request, response);
        }

        // --- Consulta (GET) ---
        else if (method === 'GET' && pathname === '/motoristas') {
            const params = parsedUrl.searchParams;
            const cpf = params.get('cpf');
            const nomeMotorista = params.get('nome');
            const pontuacao = params.get('pontuacao');

            if (cpf) {
                handleGetMotoristaByCPF(request, response, cpf);
            } else if (nomeMotorista) {
                handleGetVeiculosByNomeMotorista(request, response, nomeMotorista);
            } else if (pontuacao) {
                handleGetMotoristasComPontuacao(request, response);
            } else {
                handleGetAllMotoristas(request, response);
            }
        } else if (method === 'GET' && pathname === '/veiculos') {
            const params = parsedUrl.searchParams;
            const placa = params.get('placa');
            const nomeMotorista = params.get('nome');

            if (placa) {
                handleGetVeiculoByPlaca(request, response, placa);
            } else if (nomeMotorista) {
                handleGetVeiculosByNomeMotorista(request, response, nomeMotorista);
            } else {
                handleGetAllVeiculos(request, response); // Use the function from consultaController
            }
        } else if (method === 'GET' && pathname === '/multas') {
            const params = parsedUrl.searchParams;
            const placa = params.get('placa');

            if (placa) {
                handleGetMultasByPlaca(request, response, placa);
            } else {
                handleGetAllMultas(request, response);
            }
        }

        // --- DELETE (Exclusão) ---  NEW!
        else if (method === 'DELETE' && pathname.startsWith('/motoristas/')) {
            const id = pathname.split('/')[2]; // Extract the ID
            if (id) {
                handleDeleteMotorista(request, response, id);
            } else {
                response.statusCode = 400; // Bad Request
                response.end('ID do motorista não fornecido');
            }
        }

        // --- PUT (Update) --- NEW!
        else if(method === 'PUT' && pathname.startsWith('/motoristas/')){
            const id = pathname.split('/')[2];
            if(id){
                let body = '';
                request.on('data', chunk => {
                    body += chunk.toString();
                });

                request.on('end', () => {
                    try{
                        const parsedBody = JSON.parse(body);
                        handleUpdateMotorista(request, response, id, parsedBody)
                    }catch(error){
                        response.status(400).json({ message: 'JSON inválido no corpo da requisição' });
                    }
                })
            }else{
                response.statusCode = 400;
                response.end("Id do motorista não fornecido")
            }
        }

        else {
            response.statusCode = 404;
            response.end('Rota não encontrada');
        }
    });
});

server.listen(3333, () => {
    console.log('Servidor rodando na porta 3333');
});