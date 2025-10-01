# Articles API

## Descrição do Projeto

A **Articles API** é uma aplicação backend desenvolvida com **NestJS**, criada com o objetivo de aplicar conceitos avançados deste framework. O projeto simula um sistema de gerenciamento de artigos, permitindo que usuários criem contas, publiquem artigos e adicionem tags a determinados artigos.

Durante o desenvolvimento, foram aplicados conceitos importantes como arquitetura modular, autenticação e autorização com JWT, validação de dados com **class-validator**, além de manipulação de dados utilizando **Prisma ORM** integrado com **MongoDB**.

A aplicação também adota boas práticas como: encriptação de senhas com **bcrypt**, tratamento de erros consistente, implementação de relacionamentos entre entidades e uso de Guards, Pipes e Decorators nativos do NestJS.

## Principais Funcionalidades

* **CRUD de Usuários (Users):**

  * Criação de contas com senha encriptada.
  * Login seguro com JWT.
  * Atualização e exclusão de perfis.
  * Listagem de usuário por ID e username.

* **CRUD de Artigos (Articles):**

  * Usuários autenticados podem criar artigos.
  * Atualização e remoção de artigos próprios.
  * Adição de tags existentes aos artigos.
  * Slug automático baseado no título (minúsculas, sem acentos e com traços).
  * Listagem de artigo por ID e slug.
  * Listagem de artigos por autor ou por tag.

* **CRUD de Tags (Tags):**

  * Criação, listagem, atualização e remoção de tags.
  * Relacionamento bidirecional com artigos para consulta rápida.

* **Autenticação e Autorização:**

  * Registro de usuários com validação de dados.
  * Login com JWT.
  * Proteção de rotas com Guards.
  * Controle de acesso para edição e exclusão apenas de recursos próprios.

* **Validações e Boas Práticas:**

  * Validação de DTOs com **class-validator**.
  * Tratamento consistente de exceções com `NotFoundException`, `UnauthorizedException` e `BadRequestException`.
  * Estrutura de código modular e escalável.

## Modelagem de Dados

A modelagem foi feita com **Prisma ORM** utilizando **MongoDB** como banco de dados.

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

model Users {
  id        String     @id @default(auto()) @map("_id") @db.ObjectId
  email     String     @unique
  password  String
  username  String     @unique
  bio       String?
  image     String?
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
  articles  Articles[]
}

model Articles {
  id             String   @id @default(auto()) @map("_id") @db.ObjectId
  slug           String   @unique
  title          String
  description    String
  body           String
  favoritesCount Int      @default(0)
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  authorId       String   @db.ObjectId
  author         Users    @relation(fields: [authorId], references: [id])
  tagIDs         String[] @db.ObjectId
  tags           Tags[]   @relation(fields: [tagIDs], references: [id])
}

model Tags {
  id         String     @id @default(auto()) @map("_id") @db.ObjectId
  name       String     @unique
  createdAt  DateTime   @default(now())
  updatedAt  DateTime   @updatedAt
  articleIDs String[]   @db.ObjectId
  articles   Articles[] @relation(fields: [articleIDs], references: [id])
}
```

## Dependências

O projeto utiliza as seguintes dependências principais:

- `@nestjs/common`: ^11.0.1,
- `@nestjs/core`: ^11.0.1,
- `@nestjs/jwt`: ^11.0.0,
- `@nestjs/mapped-types`: *,
- `@nestjs/platform-express`: ^11.0.1,
- `@prisma/client`: ^6.16.2,
- `bcrypt`: ^6.0.0,
- `class-transformer`: ^0.5.1,
- `class-validator`: ^0.14.2,
- `reflect-metadata`: ^0.2.2,
- `rxjs`: ^7.8.1,
- `slugify`: ^1.6.6,
- `@eslint/eslintrc`: ^3.2.0,
- `@eslint/js`: ^9.18.0,
- `@nestjs/cli`: ^11.0.0,
- `@nestjs/schematics`: ^11.0.0,
- `@nestjs/testing`: ^11.0.1,
- `@types/bcrypt`: ^6.0.0,
- `@types/express`: ^5.0.0,
- `@types/jest`: ^30.0.0,
- `@types/node`: ^22.10.7,
- `@types/supertest`: ^6.0.2,
- `eslint`: ^9.18.0,
- `eslint-config-prettier`: ^10.0.1,
- `eslint-plugin-prettier`: ^5.2.2,
- `globals`: ^16.0.0,
- `jest`: ^30.0.0,
- `prettier`: ^3.4.2,
- `prisma`: ^6.16.2,
- `source-map-support`: ^0.5.21,
- `supertest`: ^7.0.0,
- `ts-jest`: ^29.2.5,
- `ts-loader`: ^9.5.2,
- `ts-node`: ^10.9.2,
- `tsconfig-paths`: ^4.2.0,
- `typescript`: ^5.7.3,
- `typescript-eslint`: ^8.20.0

## Como Executar o Projeto

1. Clone este repositório:

```bash
git clone https://github.com/pedrohxiv/articles-api.git
cd articles-api
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente no arquivo `.env`:

```env
DATABASE_URL="seu_valor_aqui"
SECRET_KEY="seu_valor_aqui"
```

Certifique-se de substituir `seu_valor_aqui` pelos valores corretos de cada chave.

4. Gere o cliente Prisma:

```bash
npx prisma generate
npx prisma db push
```

5. Inicie o servidor de desenvolvimento:

```bash
npm run start:dev
```

6. Acesse a API em:

```
http://localhost:3000
```

## Rotas Principais

* **Users**

  * `POST /auth/register` → Criação de usuário.
  * `POST /auth/login` → Login e geração de token JWT.
  * `GET /users` → Lista todos os usuários.
  * `GET /users/:id` → Retorna informações do usuário através do ID.
  * `GET /users/:username` → Retorna informações do usuário pelo através do username.
  * `PATCH /users/:id` → Atualiza informações do usuário.
  * `DELETE /users/:id` → Remove usuário.

* **Articles**

  * `POST /articles` → Criação de artigo com tags existentes.
  * `GET /articles` → Lista todos os artigos, podendo filtrar por `author` ou `tag`.
  * `GET /articles/:id` → Retorna detalhes de um artigo específico através do ID.
  * `GET /articles/:slug` → Retorna detalhes de um artigo específico através do slug.
  * `PATCH /articles/:id` → Atualiza artigo e lista de tags.
  * `DELETE /articles/:id` → Remove artigo.

* **Tags**

  * `POST /tags` → Criação de uma tag.
  * `GET /tags` → Lista todas as tags.
  * `GET /tags/:id` → Retorna detalhes de uma tag específico através do ID.
  * `PATCH /tags/:id` → Atualiza tag.
  * `DELETE /tags/:id` → Remove tag.

## Aprendizados

Este projeto serviu para aprimorar os conhecimentos de **NestJS** e desenvolvimento de APIs com boas práticas:

* Estrutura modular e escalável com NestJS.
* Implementação de autenticação JWT e autorização de recursos.
* Uso de Guards, Pipes e Decorators customizados.
* Integração com Prisma ORM e MongoDB.
* Implementação de CRUD completo com relacionamentos bidirecionais.
* Validação de dados e tratamento consistente de exceções.
