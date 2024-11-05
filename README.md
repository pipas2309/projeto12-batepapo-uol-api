<h1 style="text-align: center">Welcome to Bate-Papo API 👋</h1>
<p>
    <img alt="Version" src="https://img.shields.io/badge/version-2.2.0-blue.svg?cacheSeconds=2592000" />
    <a href="https://codecov.io/github/pipas2309/projeto12-batepapo-uol-api" >
        <img src="https://codecov.io/github/pipas2309/projeto12-batepapo-uol-api/graph/badge.svg?token=SI8A2BTEMY" alt="codecov badge"/>
    </a>
</p>

> Este projeto cria uma API para uma sala de bate-papo, no estilo dos anos 2000, como parte de um projeto educativo.

### 📌 Habilidades Praticadas

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

## 📋 Pré-requisitos

- **Node.js** versão 16+
- **MongoDB** instalado e em execução
- **Dotenv** para variáveis de ambiente
- **npm** para gerenciamento de pacotes


## 🚀 Instalação

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

   Garanta que o banco de dados MongoDB está configurado corretamente e funcionando.

## 🏃 Como Rodar

**Para iniciar o servidor em modo de desenvolvimento com recarga automática**:

   ```bash
   npm run dev
   ```

**Para compilar o projeto TypeScript para JavaScript**:

   ```bash
   npm run build
   ```

**Para iniciar o servidor em modo de desenvolvimento**:

   ```bash
   npm start
   ```

**Para rodar todos os testes**:

   ```bash
   npm test
   ```

## 📖 Documentação SWAGGER da API

**A documentação Swagger da API está disponível após iniciar o servidor, acessando**:
   ```bash
   http://localhost:3000/api-docs
   ```

## 🚪 Endpoints Disponíveis

| Método     | Rota            | Descrição                                                             |
|------------|-----------------|-----------------------------------------------------------------------|
| **GET**    | `/participants` | Retorna a lista de participantes na sala.                             |
| **GET**    | `/messages`     | Retorna as mensagens da sala, com opções para limitar e filtrar.      |
| **POST**   | `/participants` | Adiciona um novo participante na sala.                                |
| **POST**   | `/messages`     | Envia uma nova mensagem para a sala.                                  |
| **PUT**    | `/messages/:id` | Edita uma mensagem específica (se enviada pelo usuário autenticado).  |
| **DELETE** | `/messages/:id` | Exclui uma mensagem específica (se enviada pelo usuário autenticado). |

## 🧪 Testes e Cobertura

* O projeto utiliza Jest e supertest para testes de unidade e integração, garantindo uma cobertura de 100%.
* Relatórios de cobertura de código podem ser encontrados em ./coverage/lcov-report/index.html para visualização detalhada. Basta rodar os testes para ter acesso.

## 🧰 Uso do Makefile

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

## Autor

👤 **Lucas Palharini**

* Website: https://www.linkedin.com/in/lucas-palharini-749799166/
* Github: [@pipas2309](https://github.com/pipas2309)

### 🏠 [Homepage](https://github.com/pipas2309/projeto12-batepapo-uol-api#readme)

## 📝 Licença

Copyright © 2024 [Lucas Palharini](https://github.com/pipas2309).<br />
Este projeto é licenciado sob a [ISC](https://github.com/pipas2309/projeto12-batepapo-uol-api/blob/master/LICENSE).
