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
| `SUPABASE_SERVICE_ROLE_KEY` | Chave do servidor. Secreta! |
| `NEXT_PUBLIC_SITE_URL` | Endereço do site (ex.: `https://casamento-danielle-daniel.vercel.app`) |
| `PIX_CHAVE`, `PIX_NOME`, `PIX_CIDADE`, `PIX_BANCO` | Dados do QR Code do Pix (opcionais: sem eles, usa `NEXT_PUBLIC_PIX_KEY`, `NEXT_PUBLIC_PIX_BANK`, "Daniel Azevedo" e "Rio de Janeiro") |
| `MERCADOPAGO_ACCESS_TOKEN` | Token de produção do Mercado Pago. Vazio = botão de cartão escondido |
| `MERCADOPAGO_WEBHOOK_SECRET` | Assinatura secreta do webhook do Mercado Pago |
| `ADMIN_PASSWORD` | Senha do `/admin` |

## Admin

Entre em `/admin` com a senha da variável `ADMIN_PASSWORD` (Vercel → Settings → Environment Variables).
Trocar a senha lá e fazer Redeploy desconecta quem estava logado.

## Presentes

- Cada presente só pode ser dado uma vez: quem escolhe o tira do site na hora.
- Pix gerado e não avisado em 1 hora (`RESERVA_MINUTOS` em `lib/reservas.js`) vence, e o presente volta.
- Quem clicou em "Já fiz o Pix" fica reservado até vocês confirmarem ou cancelarem em Pagamentos.
- No admin dá para pôr/tirar do site um por um ou todos os filtrados de uma vez.
- Preço sempre múltiplo de R$ 10 e nome sem repetir (o banco confere).

## Como os dados ficam protegidos

- Todas as tabelas têm RLS ligado e **nenhuma** política para visitantes: o site público só
  acessa o banco pelas rotas em `app/api`, que rodam no servidor.
- O `/admin` também passa pelo servidor: as rotas `app/api/admin` só respondem com o cookie
  de sessão criado depois da senha certa.

## Mercado Pago (cartão)

1. Criar a conta em mercadopago.com.br e, em "Suas integrações", criar uma aplicação
   (Checkout Pro).
2. Copiar o **Access Token de produção** para `MERCADOPAGO_ACCESS_TOKEN` na Vercel.
3. Em Webhooks, cadastrar `https://SEU-SITE/api/mercadopago/webhook` com o evento
   **Pagamentos** e copiar a assinatura secreta para `MERCADOPAGO_WEBHOOK_SECRET`.
4. Fazer Redeploy e testar com um presente real de valor baixo.
