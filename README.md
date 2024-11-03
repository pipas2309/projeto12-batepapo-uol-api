<h1 align="center">Welcome to Bate-Papo API 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

> Este projeto cria uma API para uma sala de bate-papo, no estilo dos anos 2000, como parte de um projeto educativo.

### 📌 Habilidades Praticadas

- MongoDB
- Express
- Joi

## 📋 Pré-requisitos

- **Node.js** versão x.x.x
- **MongoDB**
- **Dotenv** para variáveis de ambiente

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
    
    Crie um arquivo `.env` com os valores necessários para _**URL_CONNECT_MONGO**_, **_PORT_**, **_LOGOUT_TIME_**, e **_ACTIVITY_CHECKER_TIME_**.

4. **Banco de dados**:

   Garanta que o banco de dados MongoDB está configurado corretamente e funcionando.

## 🏃 Como Rodar

   **Para iniciar o servidor em modo de desenvolvimento**:

   ```bash
   npm start
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

## Autor

👤 **Lucas Palharini**

* Website: https://www.linkedin.com/in/lucas-palharini-749799166/
* Github: [@pipas2309](https://github.com/pipas2309)

### 🏠 [Homepage](https://github.com/pipas2309/projeto12-batepapo-uol-api#readme)

## 📝 Licença

Copyright © 2024 [Lucas Palharini](https://github.com/pipas2309).<br />
Este projeto é licenciado sob a [ISC](https://github.com/pipas2309/projeto12-batepapo-uol-api/blob/master/LICENSE).
