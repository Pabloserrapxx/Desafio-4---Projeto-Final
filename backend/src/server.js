import http from "node:http";
import cors from 'cors';
import {
    handleGetAllMotoristas,
    handleGetMotoristaByCPF,
    handleGetVeiculosByNomeMotorista, // Importe a função modificada
    handleGetVeiculoByPlaca, // Importe a nova função
    handleGetAllMultas,
    handleGetMultasByPlaca,
    handleGetMotoristasComPontuacao,

} from './controllers/consultaController.js';
import { handleCadastroMotorista, handleCadastroVeiculo, handleCadastroMulta } from './controllers/cadastroController.js';

const server = http.createServer((request, response) => {
    cors()(request, response, () => {
        const { method, url: requestUrl } = request;
        const parsedUrl = new URL(requestUrl, `http://${request.headers.host}`);
        const pathname = parsedUrl.pathname;

        if (method === 'OPTIONS') {
            response.writeHead(204, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            });
            response.end();
            return;
        }

        if (method === 'POST' && pathname === '/motoristas') {
            handleCadastroMotorista(request, response);
        } else if (method === 'POST' && pathname === '/veiculos') {
            handleCadastroVeiculo(request, response);
        } else if (method === 'POST' && pathname === '/multas') {
            handleCadastroMulta(request, response);
        } else if (method === 'GET' && pathname === '/motoristas') {
            const params = parsedUrl.searchParams;
            const cpf = params.get('cpf');
            const nomeMotorista = params.get('nome');
            const pontuacao = params.get('pontuacao'); // Obtenha o parâmetro 'pontuacao'

            if (cpf) {
                handleGetMotoristaByCPF(request, response, cpf);
            } else if (nomeMotorista) {
                handleGetVeiculosByNomeMotorista(request, response, nomeMotorista);
            } else if (pontuacao) {
                handleGetMotoristasComPontuacao(request, response); // Chama a nova função
            }
            else {
                handleGetAllMotoristas(request, response);
            }
        }  else if (method === 'GET' && pathname === '/veiculos') {
            const params = parsedUrl.searchParams;
            const placa = params.get('placa');

            if (placa) {
                handleGetVeiculoByPlaca(request, response, placa);
            } else {
                response.statusCode = 400;
                response.end('Erro: Parâmetro "placa" obrigatório.');
            }
        }
        else if (method === 'GET' && pathname === '/multas') {
            const params = parsedUrl.searchParams;
            const placa = params.get('placa');

            if(placa){
                handleGetMultasByPlaca(request, response, placa);
            }else{
                handleGetAllMultas(request, response);
            }

        }else {
            response.statusCode = 404;
            response.end('Rota não encontrada');
        }
    });
});

server.listen(3333, () => {
    console.log('Servidor rodando na porta 3333');
});