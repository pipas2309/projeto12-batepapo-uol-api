<h1 style="text-align: center">Welcome to Bate-Papo API 👋</h1>
<p>
    <img alt="Version" src="https://img.shields.io/badge/version-2.2.0-blue.svg?cacheSeconds=2592000" />
    <a id="codecov" href="https://codecov.io/github/pipas2309/projeto12-batepapo-uol-api" >
        <img src="https://codecov.io/github/pipas2309/projeto12-batepapo-uol-api/graph/badge.svg?token=SI8A2BTEMY" alt="codecov badge"/>
    </a>
</p>

---

## Índice

- [📜 Descrição](#descrição)
- [🧩 Tecnologias](#tecnologias)
- [⚙️ Instalação](#instalação)
- [🕹️ Como Usar](#como-usar)
- [🚪 Rotas da API](#rotas-da-api)
  - [Mensagens](#mensagens)
  - [Participantes](#participantes)
  - [Status](#status)
- [🧪 Testes](#testes)
- [📖 Swagger](#swagger)
- [🧰 Makefile](#makefile)
- [🤝 Contribuindo](#contribuindo)
- [👤 Autor](#autor)
- [📝 Licença](#licença)

---

## Descrição
Este projeto é uma API para um sistema de bate-papo online, onde os usuários podem interagir em uma sala pública ou enviar mensagens privadas. Ele foi desenvolvido com **Node.js** e **Express**, integrando um banco de dados **MongoDB** para persistência de dados.

[⬆ Voltar ao Índice](#índice)

## Tecnologias

- MongoDB
- Express
- Joi
- Swagger
- TypeScript
- Arquitetura em camadas
- ESLint e Prettier
- CI/CD
- Jest e supertest
- Makefile

[⬆ Voltar ao Índice](#índice)

## Instalação

1. **Clone o repositório**:
   ```bash
   git clone https://github.com/pipas2309/projeto12-batepapo-uol-api.git
   cd projeto12-batepapo-uol-api
   ```

2. **Instale as dependências**:

    ```bash
    npm install
   ```

3. **Configure as variáveis de ambiente**:

    Crie um arquivo `.env` com os valores necessários, siga o exemplo.
    ```bash
    URL_CONNECT_MONGO=sua_url_de_conexao_com_mongodb
    URL_CONNECT_MONGO_TEST=sua_url_de_conexao_com_mongodb-teste
    PORT=3000
    LOGOUT_TIME=15000 # Tempo que um usuário pode ficar sem enviar o status para o servidor e permanecer online em MS.
    ACTIVITY_CHECKER_TIME=5000 # Tempo entre as verificações de usuários logados em MS.
    NODE_ENV=dev
    ```

4. **Banco de dados**:

   Garanta que o banco de dados MongoDB está instaládo e configurado.

## Como Usar

**Para iniciar o servidor rápidamente**:

   `make run`

**Para compilar o projeto TypeScript para JavaScript**:

   `npm run build`

**Para iniciar o servidor em modo de desenvolvimento com recarga automática**:

   `npm run dev`

**Para rodar todos os testes**:

   `npm test`

[⬆ Voltar ao Índice](#índice)

## Rotas da API

<details>
<summary id="mensagens">📌 Mensagens</summary>

### Obtém mensagens filtradas por usuário e tipo de mensagem.

```http
GET /messages
```

**Parâmetros:**

| Query | Tipo    | Descrição                                       | Obrigatório |
|-------|---------|-------------------------------------------------|-------------|
| limit | integer | Limite de mensagens a serem retornadas.         | Não         |

**Responses:**

- 200 OK: Retorna uma lista de mensagens.

---

### Adiciona uma nova mensagem.

```http
POST /messages
```

**Parâmetros:**

| Header | Tipo   | Descrição        | Obrigatório |
|--------|--------|------------------|-------------|
| user   | string | Nome do usuário. | Sim         |

| Body | Tipo   | Descrição                   | Obrigatório |
|------|--------|-----------------------------|-------------|
| from | string | Nome do remetente.          | Sim         |
| to   | string | Nome do destinatário.       | Sim         |
| text | string | Mensagem.                   | Sim         |
| type | enum   | message ou private_message. | Sim         |


**Responses:**

- 201 Created: Mensagem criada com sucesso.
- 400 Bad Request: Formato inválido.
- 403 Forbidden: Usuário não logado.

---

### Atualiza uma mensagem existente.

```http
PUT /messages/{id}
```

**Parâmetros:**

| Header | Tipo   | Descrição        | Obrigatório |
|--------|--------|------------------|-------------|
| user   | string | Nome do usuário. | Sim         |

| Params | Tipo   | Descrição                  | Obrigatório |
|--------|--------|----------------------------|-------------|
| id     | string | ID da mensagem (ObjectID). | path        |

| Body | Tipo   | Descrição                   | Obrigatório |
|------|--------|-----------------------------|-------------|
| from | string | Nome do remetente.          | Sim         |
| to   | string | Nome do destinatário.       | Sim         |
| text | string | Nova mensagem.              | Sim         |
| type | enum   | message ou private_message. | Sim         |

**Responses:**

- 200 OK: Mensagem atualizada com sucesso.
- 400 Bad Request: Formato inválido.
- 401 Unauthorized: Sem permissão de edição.
- 404 Not Found: Mensagem não encontrada.

---

### Deleta uma mensagem.

```http
DELETE /messages/{id}
```

**Parâmetros:**

| Header | Tipo   | Descrição        | Obrigatório |
|--------|--------|------------------|-------------|
| user   | string | Nome do usuário. | Sim         |

| Params | Tipo   | Descrição                  | Obrigatório |
|--------|--------|----------------------------|-------------|
| id     | string | ID da mensagem (ObjectID). | path        |

**Responses:**

- 200 OK: Mensagem deletada com sucesso.
- 401 Unauthorized: Sem permissão de edição.
- 404 Not Found: Mensagem não encontrada.

</details>

<details>
<summary id="participantes">📌 Participantes</summary>

### Obtém todos os participantes.

```http
GET /participants
```

**Parâmetros:** Nenhum

**Responses:**

- 200 OK: Retorna uma lista de participantes.

---

### Adiciona um novo participante.

```http
POST /participants
```

**Parâmetros:**

| Nome | Tipo   | Descrição        | Obrigatório |
|------|--------|------------------|-------------|
| name | string | Nome do usuário. | body        |

**Responses:**

- 201 Created: Participante criado com sucesso.
- 400 Bad Request: Formato inválido.
- 409 Conflict: Nome de usuário já está em uso.

</details>

<details>
<summary id="status">📌 Status</summary>

### Atualiza o status do participante.

```http
POST /status
```

**Parâmetros:**

| Nome   | Tipo   | Descrição        | Obrigatório |
|--------|--------|------------------|-------------|
| user   | string | Nome do usuário. | header      |

**Responses:**

- 200 OK: Status atualizado com sucesso.
- 404 Not Found: Usuário não encontrado.

</details>

[⬆ Voltar ao Índice](#índice)

## Swagger

A documentação Swagger da API está disponível após iniciar o servidor, acessando:
`http://localhost:3000/api-docs`.<br>
Particularmente útil para testar diretamente pela interface do swagger.

[⬆ Voltar ao Índice](#índice)

## Contribuindo

Se você quiser contribuir com este projeto:

1. Faça um fork do repositório.
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`).
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`).
   1. Siga padrões de commits com tags 'feat:', 'chore:', 'fix:' por padrão os commits são em inglês.
   2. Pode consultar uns exemplos nesse repo [iuricode/padroes-de-commits](https://github.com/iuricode/padroes-de-commits).
4. Envie para o repositório remoto (`git push origin feature/nova-feature`).
5. Abra um Pull Request para a develop.

[⬆ Voltar ao Índice](#índice)

## Testes

* O projeto utiliza Jest e supertest para testes de unidade e integração, garantindo uma excelente cobertura.
* Relatórios de cobertura de código podem ser encontrados em:
  * ./coverage/lcov-report/index.html **após** rodar localmente o `npm test`
  * No badge da [codecov](#codecov).

[⬆ Voltar ao Índice](#índice)

## Makefile

**O projeto inclui um Makefile com comandos úteis para gerenciar o MongoDB e atualizar a versão do projeto.**

* Ajuda: `make help` ou apenas `make`
* Iniciar o MongoDB: `make start`
* Verificar o status do MongoDB: `make status`
* Parar o MongoDB: `make stop`
* Atualiza a versão do projeto: `make bv <tipo>`
  * Onde `<tipo>` pode ser:
    * major: Incrementa a versão principal (X.0.0).
    * minor: Incrementa a versão secundária (x.X.0).
    * patch: Incrementa a versão de patch (x.x.X).
  exemplo: `make bv patch`

[⬆ Voltar ao Índice](#índice)

## Autor

**Lucas Palharini**

* [Linkedin](https://www.linkedin.com/in/lucas-palharini)
* Github: [@pipas2309](https://github.com/pipas2309)

## Licença

Copyright © 2024 [Lucas Palharini](https://github.com/pipas2309).<br />
Este projeto é licenciado sob a [ISC](https://github.com/pipas2309/projeto12-batepapo-uol-api/blob/master/LICENSE).

[⬆ Voltar ao Índice](#índice)
