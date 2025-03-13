-- init.sql

USE Dentran; -- Seleciona o banco de dados Dentran

CREATE TABLE IF NOT EXISTS motorista (
    id_motorista INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(11) NOT NULL UNIQUE,
    pontuacao INT,
    data_nascimento DATE
);

CREATE TABLE IF NOT EXISTS veiculo (
    id_veiculo INT AUTO_INCREMENT PRIMARY KEY,
    placa VARCHAR(7) NOT NULL UNIQUE,
    ano INT,
    modelo VARCHAR(255),
    id_motorista INT,
    FOREIGN KEY (id_motorista) REFERENCES motorista(id_motorista)
);

CREATE TABLE IF NOT EXISTS multa (
    id_multa INT AUTO_INCREMENT PRIMARY KEY,
    data DATE,
    pontuacaoNaCarteira INT,
    valor DECIMAL(10, 2),
    placa VARCHAR(7),
    FOREIGN KEY (placa) REFERENCES veiculo(placa)
);