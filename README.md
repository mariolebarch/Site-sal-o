# Studio Rosely Lebarch — Nails Design

Site institucional + sistema de agendamento para o Studio Rosely Lebarch
(@studioroselebarch). Construído com React, TypeScript, Vite, Tailwind CSS,
React Router e **Supabase** (banco de dados Postgres + autenticação),
compartilhado entre todos os dispositivos.

## Configurando o Supabase (obrigatório)

O projeto Supabase já usado se chama **"Salão - Rosely"**. Para conectar:

1. **Rode o esquema do banco.** No [Supabase Studio](https://supabase.com/dashboard),
   abra o projeto → **SQL Editor** → **New query**, cole todo o conteúdo de
   `supabase/schema.sql` e clique em **Run**. Isso cria as tabelas
   (`services`, `app_settings`, `blocked_dates`, `blocked_ranges`,
   `appointments`), as regras de segurança (RLS) e os serviços padrão.
2. **Crie a conta da profissional.** Em **Authentication → Users → Add user**,
   crie um usuário com e-mail e senha (marque "Auto Confirm User"). É esse
   e-mail/senha que a Rosely vai usar para entrar em `/login`.
3. **Configure as variáveis de ambiente.** Em **Project Settings → API**,
   copie a **Project URL** e a chave **anon public**, e crie um arquivo
   `.env` na raiz do projeto (baseado em `.env.example`):

   ```
   VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anon-public
   ```

   O arquivo `.env` não é versionado (está no `.gitignore`).

## Rodando localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

Build de produção:

```bash
npm run build
npm run preview
```

## Estrutura

- `/` — site institucional (hero, sobre, serviços, galeria, depoimentos,
  localização).
- `/agendar` — fluxo de agendamento dinâmico: categoria → procedimento →
  data → horário (calculado automaticamente pela duração do serviço,
  horário de funcionamento e bloqueios) → dados do cliente → confirmação
  (com link para confirmar via WhatsApp).
- `/login` — acesso à área administrativa (e-mail e senha cadastrados no
  Supabase Auth).
- `/admin` — painel da profissional: dashboard, agenda, bloqueio de
  datas/horários, gestão de serviços, horário de funcionamento e troca de
  senha.

## Adicionando as fotos reais do Instagram

O site foi montado com ilustrações no lugar das fotos porque este ambiente
de desenvolvimento não tem acesso ao Instagram. Veja
`public/images/README.md` para a lista exata de arquivos e onde cada um
aparece — basta soltar os arquivos na pasta com o nome certo, sem mexer em
código.

## Sobre a persistência de dados

Os dados (serviços, horário de funcionamento, bloqueios e agendamentos)
ficam em um banco Supabase (Postgres) compartilhado — clientes e a
profissional veem a mesma agenda, em qualquer dispositivo ou navegador.

Regras de acesso (Row Level Security):

- Qualquer visitante pode **ler** serviços, horário de funcionamento e
  bloqueios, e **criar** um novo agendamento (necessário para o fluxo de
  `/agendar`).
- Apenas a profissional autenticada (login em `/login`) pode **ver a lista
  completa de agendamentos** (nome/telefone das clientes) e **editar**
  serviços, horários e bloqueios.
- Para calcular os horários livres em `/agendar` sem expor nome/telefone
  de outras clientes, o site usa a função `get_booked_slots`, que devolve
  apenas os horários já ocupados (sem dados pessoais).

## Deploy (GitHub Pages)

O build de produção precisa das variáveis `VITE_SUPABASE_URL` e
`VITE_SUPABASE_ANON_KEY` definidas no momento do `npm run build` (elas são
"assadas" no bundle, pois o site é 100% estático). Se publicar via GitHub
Actions/Pages, configure essas duas variáveis como *secrets*/*variables* do
repositório e exporte-as antes do build.
