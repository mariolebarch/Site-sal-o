# Studio Rosely Lebarch — Nails Design

Site institucional + sistema de agendamento para o Studio Rosely Lebarch
(@studioroselebarch). Construído com React, TypeScript, Vite, Tailwind CSS e
React Router. Os dados (agenda, bloqueios, serviços e senha do painel) ficam
salvos no `localStorage` do navegador — não há backend/servidor.

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
- `/login` — acesso à área administrativa.
- `/admin` — painel da profissional: dashboard, agenda, bloqueio de
  datas/horários, gestão de serviços, horário de funcionamento e troca de
  senha.

**Senha padrão do painel admin:** `rosely2026` (altere em
Configurações após o primeiro acesso).

## Adicionando as fotos reais do Instagram

O site foi montado com ilustrações no lugar das fotos porque este ambiente
de desenvolvimento não tem acesso ao Instagram. Veja
`public/images/README.md` para a lista exata de arquivos e onde cada um
aparece — basta soltar os arquivos na pasta com o nome certo, sem mexer em
código.

## Sobre a persistência de dados

Este projeto não tem backend: agendamentos, bloqueios e configurações
ficam salvos no `localStorage` do navegador de quem acessa. Isso significa
que:

- Os agendamentos feitos por clientes em um dispositivo só aparecem no
  painel admin se for o **mesmo navegador**.
- Para uso real em produção (clientes e admin em dispositivos diferentes
  vendo a mesma agenda), é necessário um backend com banco de dados
  compartilhado (ex.: Supabase, Firebase, ou uma API própria) substituindo
  o `src/store/useAppStore.ts`.
