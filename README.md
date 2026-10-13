# Do Zero ao CPA - Frontend

Frontend do aplicativo educacional gamificado **Do Zero ao CPA**.

- App em producao: https://do-zero-ao-cpa.vercel.app/
- Repositorio hub: https://github.com/Meog38/do-zero-ao-cpa
- Backend: https://github.com/Meog38/do-zero-ao-cpa-backend
- API publica: https://brainvest-api.onrender.com

## Sobre

O app ajuda jovens estudantes a praticar organizacao financeira, uso responsavel do cartao de credito e conceitos iniciais de investimentos. A experiencia usa missoes, questoes contextualizadas, feedback imediato, XP, vidas, gemas e progresso.

Este projeto foi iniciado no Lovable e segue conectado ao fluxo de sincronizacao via Git.

## Stack

- React 19
- TypeScript
- TanStack Router e TanStack Start
- Vite
- Tailwind CSS 4
- Radix UI
- Vitest e Testing Library

## Rodar localmente

Requisitos: Node.js e npm.

```sh
npm install
npm run dev
```

Por padrao, o frontend usa a API publicada em:

```text
https://brainvest-api.onrender.com
```

Para usar uma API local, crie um arquivo `.env.local` nao versionado:

```env
VITE_API_BASE_URL=http://localhost:8082
```

Depois reinicie o servidor Vite.

## Scripts

```sh
npm run dev       # servidor de desenvolvimento
npm run build     # build de producao
npm run preview   # preview local do build
npm run test      # testes automatizados
npm run lint      # lint
```

## Estrutura principal

- `src/routes/index.tsx`: fluxo principal do app e telas.
- `src/lib/learning-content.ts`: conteudo local de fallback das trilhas.
- `src/lib/brainvest-api.ts`: cliente REST do backend.
- `src/lib/user-progress.ts`: progresso local no navegador.
- `src/components/ui`: componentes de UI baseados em Radix.
- `src/assets/mascot.png`: mascote usado na interface.

## Deploy

O deploy principal do frontend esta na Vercel:

```text
https://do-zero-ao-cpa.vercel.app/
```

Tambem existe historico do projeto no Lovable. Se o ambiente Lovable for usado, confirme se `VITE_API_BASE_URL` aponta para a API publica e se o backend permite a origem correta no CORS.

## Observacoes

O frontend mantem progresso local quando o usuario nao esta logado. Para contas autenticadas, o progresso e sincronizado com o backend. O projeto tem finalidade educacional e nao faz recomendacao individual de investimentos.
