- `POST /api/motorista/`

  - Entrada: Dados do motorista
    ```json
    {
      "cpf": "00000000000",
      "nome": "Fulano",
      "data_nascimento": "08-12-2001",
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
- `GET /api/motorista/ `

  - Entrada: (nenhuma)
  - Saída: Lista de motoristas

    ```json
    [
      {
        "cpf": "00000000000",
        "nome": "Fulano",
        "data_nascimento": "25-09-2002",
        "pontuacao": "0"
      },
      {
        "cpf": "03050034383",
        "nome": "Beltrano",
        "data_nascimento": "22-11-2001",
        "pontuacao": "4"
      },
      {
        "cpf": "001.051.300-00",
        "nome": "Joãozinho",
        "data_nascimento": "02-07-2004",
        "pontuacao": "0"
      }
    ]
    ```

    - `GET /api/carro/<cpf_motorista>`

  - Entrada: CPF do motorista
  - Saída: Lista de carros do motorista

    ```json
    [
      {
        "placa": "ABC1000",
        "modelo": "SUV",
        "ano": 2015,
      },
      {
        "placa": "ASD6084",
        "modelo": "HATCH",
        "ano": 2018,
      },
      {
        "placa": "HFD7389",
        "modelo": "SEDAN",
        "ano": 2012,
      }
    ]
    ```
