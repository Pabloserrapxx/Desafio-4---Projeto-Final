import mysql from "mysql2";

export const conexão = mysql.createConnection({
    host: 'db', // Use 'db' (nome do serviço no docker-compose.yml) ou locahost quando não usar o docker para carregar
    user: 'root',
    password: "Abacaxi741*",
    database: "Dentran"
});

conexão.connect(function (erro) {
    if (erro) throw erro;
    console.log("A conexão foi um sucesso");
});