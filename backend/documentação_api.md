- `POST /api/motorista/`

  - Entrada: Dados do motorista
    ```json
    {
      "cpf": "000.000.000-00",
      "nome": "Fulano",
      "data_nascimento": "2025-12-15",
      "pontuacao": "0"
    }
    ```
  - Saída: (nenhuma)

- `POST /api/carro/`

  - Entrada: Dados do Veiculo
    ```json
    {
      "placa": "ABC-1AVD",
      "modelo": "Focus",
      "ano": 2015
    }
    ```
  - Saída: (nenhuma)

- `POST /api/multa/`

  - Entrada: Dados da multa
    ```json
    {
      "valor": 293.47,
      "data": "2020-01-01",
      "pontuacaoNaCarteira": 4
      
    }
    ```
  - Saída: (nenhuma)

-
