# Site de Casamento · Danielle & Daniel

**27 de novembro de 2026 · Rio de Janeiro**

Next.js 14 + Supabase (projeto `casamento-dd`) + Mercado Pago. Publicado na Vercel a cada
push na `main`.

## Páginas

| Endereço | O que tem |
| --- | --- |
| `/inicio` | Capa, foto dos noivos e contagem regressiva |
| `/ceremonia`, `/recepcao` | Local, horário, endereço e mapa |
| `/presentes` | Presentes fictícios (o convidado dá o valor em dinheiro), com filtros |
| `/presentes/[id]` | Recado para os noivos e pagamento por Pix (QR Code) ou cartão |
| `/confirmacao` | Confirmação de presença por grupo (Vai / Não vai) |
| `/admin` | Painel dos noivos (login do Supabase) |

## Rodar no computador

```bash
npm install
npm run dev
```

Crie um `.env.local` com as variáveis abaixo (os valores ficam na Vercel, em
Settings → Environment Variables). **Nunca coloque os valores neste repositório.**

| Variável | Para que serve |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Endereço do Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública (usada só no login do admin) |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave do servidor. Secreta! |
| `NEXT_PUBLIC_SITE_URL` | Endereço do site (ex.: `https://casamento-danielle-daniel.vercel.app`) |
| `PIX_CHAVE`, `PIX_NOME`, `PIX_CIDADE`, `PIX_BANCO` | Dados do QR Code do Pix (opcionais: sem eles, usa `NEXT_PUBLIC_PIX_KEY`, `NEXT_PUBLIC_PIX_BANK`, "Daniel Azevedo" e "Rio de Janeiro") |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de produção do Mercado Pago. Vazio = botão de cartão escondido |
| `MERCADOPAGO_WEBHOOK_SECRET` | Assinatura secreta do webhook do Mercado Pago |

## Admin

1. No Supabase: Authentication → Users → Add user (com "Auto Confirm User").
2. O e-mail precisa estar na tabela `admins` (SQL Editor:
   `insert into admins (email) values ('email@exemplo.com');`).
3. Entre em `/admin` com esse e-mail e senha.

## Como os dados ficam protegidos

- Todas as tabelas têm RLS ligado e **nenhuma** política para visitantes: o site público só
  acessa o banco pelas rotas em `app/api`, que rodam no servidor.
- No `/admin`, o navegador usa a chave pública + o login; o banco só libera os dados para
  e-mails da tabela `admins` (função `privado.is_admin()`).

## Mercado Pago (cartão)

1. Criar a conta em mercadopago.com.br e, em "Suas integrações", criar uma aplicação
   (Checkout Pro).
2. Copiar o **Access Token de produção** para `MERCADOPAGO_ACCESS_TOKEN` na Vercel.
3. Em Webhooks, cadastrar `https://SEU-SITE/api/mercadopago/webhook` com o evento
   **Pagamentos** e copiar a assinatura secreta para `MERCADOPAGO_WEBHOOK_SECRET`.
4. Fazer Redeploy e testar com um presente real de valor baixo.
