# Juntos Online API

API REST para o projeto "Juntos Online" - uma plataforma de classificados desenvolvida como projeto de faculdade.

## Stack

- **Runtime**: Node.js
- **Linguagem**: TypeScript
- **Framework**: Express
- **Banco de Dados**: PostgreSQL + Sequelize ORM
- **Validação**: Zod
- **Autenticação**: JWT + bcrypt
- **Upload de arquivos**: AWS S3 (Multer)
- **Testes**: Vitest
- **Migrações**: Umzug

## Scripts

```bash
npm run dev          # Inicia o servidor em modo de desenvolvimento
npm run build        # Compila o projeto para produção
npm run start        # Inicia o servidor em produção
npm run test         # Executa os testes
npm run test:run     # Executa os testes uma vez
npm run test:coverage # Executa os testes com cobertura
npm run migrate      # Executa as migrações do banco
npm run lint         # Verifica o código
npm run format       # Formata o código
npm run lint:fix     # Formata e verifica o código
```

## Releases

- **release-i**: Início do projeto - estrutura básica com autenticação, usuários, provedores e anúncios
- **release-ii**: Aprimoramento no gerenciamento de anúncios com estados de loading e uploads de imagem
- **release-iii (atual)**: Testes automatizados com Vitest, pipeline de CI/CD com GitHub Actions e mem-cache na rota de anúncios

> As versões anteriores do código estão salvas nas branches `release-i` e `release-ii`.

## Estrutura do Projeto

```
src/
├── controllers/    # Controladores das rotas
├── errors/         # Classes de erros HTTP customizados
├── middlewares/    # Middlewares do Express
├── migrations/     # Migrações do banco de dados
├── models/         # Modelos do Sequelize
├── routes/         # Definição das rotas
├── schemas/        # Schemas de validação Zod
├── services/       # Lógica de negócio
├── types/          # Tipos e interfaces TypeScript
├── utils/          # Utilitários (db, jwt, bcrypt, etc.)
├── api.ts          # Configuração principal do Express
├── config.ts       # Configurações do ambiente
└── main.ts         # Ponto de entrada da aplicação
```

## Autor

Hitalo Loose (hitaloose@gmail.com)