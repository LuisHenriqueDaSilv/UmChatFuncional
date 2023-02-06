<div align="center">
<strong>

<img src="https://i.imgur.com/iQhocSu.png" width="70%"></img>

<strong>#BoraCodar(4) um chat funcional!</strong>
<p>Usando como base a interface entregue no desafio 4 do <a href="https://boracodar.dev">#BoraCodar</a>, desenvolvi um chat funcional. Nele, usei algumas ferramentas do ambiente Javascript para desenvolver um serviço com recursos de criação de conta, autenticação usando <a href="https://jwt.io">JWT</a>, conexão em tempo real entre os usuários, entre outros.</p>

</br></br>

<strong>Ferramentas usadas: </strong>

  | Projeto  | descrição |
  | ------------- | ------------- |
  | [NodeJs](https://nodejs.org/en/) | Como ambiente |
  | [Express](https://expressjs.com) | Como base do back-end. |
  | [React](https://pt-br.reactjs.org)  | No front-ent. |
  | [Typescript](https://www.typescriptlang.org)  | No back-end e front-end. Proporcionando um desenvolvimento mais produtivo e seguro. |
  | [SocketIo](https://socket.io)  | Para conexão em tempo real entre os usuários. |
  | [Prisma](https://prisma.io)  | No back-end para o controle do banco de dados. |

</br></br>

<strong>Como rodar?</strong>
<div align="left">

</br>
Primeiro, clone o repositório <a href="https://github.com/LuisHenriqueDaSilv/UmChatFuncional.git">LuisHenriqueDaSilv/UmChatFuncional</a> usando o seguinte comando:

```shell 
git clone https://github.com/LuisHenriqueDaSilv/UmChatFuncional.git
```

</br>

⚠️⚠️ Antes de rodar o backend você precisa configurar as seguintes variaveis de ambiente:

```shell
DATABASE_URL="file:../database/dev.db" #Endereço do arquivo para o banco de dados
JWT_SECRET_KEY= # Uma chave qualquer para identificação dos JWT's da aplicação 
```
 A forma mais fácil de configurar essas variáveis é criando um arquivo .env dentro de ```/backend```.

</br>

Já com o repositório em sua máquina e ainda no diretório onde o repositório foi clonado,  rode o backend:

```shell 
cd backend # Entra no diretório do servidor
npm install # Instala todas as dependecias citadas no package.json
npx prisma migrate # Cria uma migration no banco de dados(SQLite) seguindo o modelo de /prisma/schema.prisma
npm run dev #Inicia o servidor
```

</br>

Com o backend iniciado, em outra aba do terminal, rode o frontend:


```shell 
cd web # Entra no diretório do frontent
npm install # Instala todas as dependecias citadas no package.json
npm run dev #Inicia o frontend
```

Após isso, você deve ver uma mensagem no terminal contendo o endereço local para acessar a aplicação. Por padrão é "<a href="localhost:5173/">http://localhost:5173/</a>".

</br>
<p align="center"> E pronto. A aplicação está rodando! </p>

<div align="left">

</div>

</strong>