# 🚀 COMO SUBIR O SITE NA VERCEL

Siga este guia passo a passo para colocar o site no ar.

---

## ✅ PRÉ-REQUISITOS

Você já tem tudo pronto:
- ✅ Conta no Mercado Pago criada
- ✅ Credenciais do Mercado Pago
- ✅ Projeto no Supabase criado
- ✅ Tabelas criadas no banco (gifts, guests, gift_claims, confirmations)
- ✅ Credenciais do Supabase

---

## 📦 PASSO 1: BAIXAR O PROJETO

Este projeto já está completo em `/home/claude/wedding-dd/`.

Se você está vendo isso depois de baixar o ZIP, descompacte e navegue até a pasta.

---

## 💻 PASSO 2: TESTAR LOCALMENTE (OPCIONAL MAS RECOMENDADO)

1. **Instale o Node.js** se ainda não tiver:
   - Acesse https://nodejs.org
   - Baixe a versão LTS (recomendada)
   - Instale normalmente

2. **Abra o terminal** na pasta do projeto

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Rode o projeto localmente:**
   ```bash
   npm run dev
   ```

5. **Abra no navegador:**
   http://localhost:3000

Você deve ver o site funcionando! Teste navegar pelas abas, mas os pagamentos ainda não vão funcionar (precisa estar no ar pra isso).

---

## 🌐 PASSO 3: CRIAR CONTA NA VERCEL

1. Acesse https://vercel.com
2. Clique em **"Sign Up"** (Criar conta)
3. Escolha **"Continue with GitHub"** (é o mais fácil)
4. Se não tem GitHub, crie em https://github.com primeiro
5. Autorize a Vercel a acessar sua conta GitHub

---

## 📤 PASSO 4: SUBIR O CÓDIGO PRO GITHUB

### Opção A: Pelo site do GitHub (mais fácil)

1. Acesse https://github.com/new
2. Nome do repositório: `casamento-danielle-daniel`
3. **IMPORTANTE:** Marque **"Private"** (privado)
4. Clique em **"Create repository"**
5. Na próxima tela, clique em **"uploading an existing file"**
6. **Arraste toda a pasta do projeto** (menos node_modules e .next se existirem)
7. Clique em **"Commit changes"**

### Opção B: Pelo terminal (se souber usar Git)

```bash
git init
git add .
git commit -m "Primeiro commit - Site de casamento"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/casamento-danielle-daniel.git
git push -u origin main
```

---

## 🚀 PASSO 5: FAZER DEPLOY NA VERCEL

1. Acesse https://vercel.com/dashboard
2. Clique em **"Add New..."** → **"Project"**
3. **Importe o repositório** `casamento-danielle-daniel`
4. A Vercel vai detectar automaticamente que é um projeto Next.js
5. **IMPORTANTE:** Antes de clicar em "Deploy", clique em **"Environment Variables"**

---

## 🔑 PASSO 6: ADICIONAR AS VARIÁVEIS DE AMBIENTE

Copie as variáveis do arquivo `.env.example` e cole na Vercel:

Clique em **"Add"** e cole cada uma dessas (NOME → VALOR):

```
NEXT_PUBLIC_SUPABASE_URL
https://phlmgwfymzdhlxdrjeuh.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobG1nd2Z5bXpkaGx4ZHJqZXVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1NDE4MjQsImV4cCI6MjA5NTExNzgyNH0.Q91lS4R-BiC6Wy0wQL6kaP0T5cNXY6SjREL9N3aw0Jw

SUPABASE_SERVICE_ROLE_KEY
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobG1nd2Z5bXpkaGx4ZHJqZXVoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3OTU0MTgyNCwiZXhwIjoyMDk1MTE3ODI0fQ.vxcojO10d29KgoZCJaebQ5ZOsJuMKHVvWXPhVoTXLUI

NEXT_PUBLIC_MP_PUBLIC_KEY
APP_USR-25db4946-4e98-41c6-b3af-ce889cc82ade

MP_ACCESS_TOKEN
APP_USR-2511842816093103-052314-b7a93f4add797d5a874bd2ddc438422f-3422204968

NEXT_PUBLIC_PIX_KEY
danielpazevedo98@gmail.com

NEXT_PUBLIC_PIX_BANK
Banco Inter

ADMIN_PASSWORD
danieldanielle2026

NEXT_PUBLIC_SITE_URL
https://SEU-DOMINIO.vercel.app
```

⚠️ **IMPORTANTE:** Deixe `NEXT_PUBLIC_SITE_URL` em branco por enquanto. Você vai preencher depois.

---

## 🎉 PASSO 7: FAZER O DEPLOY

1. Clique em **"Deploy"**
2. Aguarde uns 2 minutos (a Vercel vai construir o site)
3. Quando terminar, você vai ver **"Congratulations!"**
4. Clique em **"Visit"** pra ver o site no ar!

---

## 🔗 PASSO 8: PEGAR A URL E ATUALIZAR

1. A URL vai ser algo como: `https://casamento-danielle-daniel.vercel.app`
2. **COPIE essa URL completa**
3. Volte na Vercel → **Settings** → **Environment Variables**
4. Encontre `NEXT_PUBLIC_SITE_URL`
5. Clique em **"Edit"** e cole a URL completa que você copiou
6. Clique em **"Save"**
7. Volte em **"Deployments"** → clique nos 3 pontinhos do deploy mais recente → **"Redeploy"**

Pronto! Agora o Mercado Pago vai conseguir redirecionar de volta pro seu site depois do pagamento.

---

## 🎨 PASSO 9: ADICIONAR FOTOS REAIS (DEPOIS)

As fotos estão como placeholders por enquanto. Para trocar:

1. Prepare 3 fotos:
   - `noivos.jpg` — foto dos noivos (vertical, proporção 4:5)
   - `igreja.jpg` — foto da Igreja Sagrado Coração de Jesus
   - `festa.jpg` — foto da Casa de Festas Monet

2. Na Vercel, vá em **Storage** → **Blob** → **Create Store**
3. Faça upload das fotos
4. Pegue as URLs públicas
5. No painel admin do site, edite os presentes e cole as URLs das fotos

OU use qualquer serviço de hospedagem de imagens (Cloudinary, ImgBB, etc.)

---

## 🔐 ACESSAR O PAINEL ADMIN

1. Acesse: `https://SEU-SITE.vercel.app/admin`
2. Senha: `danieldanielle2026`

Ali você pode:
- Adicionar/remover presentes
- Adicionar/remover convidados
- Ver quem já presenteou
- Ver quem confirmou presença

---

## ❓ PROBLEMAS COMUNS

### "Erro ao conectar com o banco de dados"
→ Verifique se as variáveis `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` estão corretas na Vercel.

### "Erro ao criar preferência de pagamento"
→ Verifique se `MP_ACCESS_TOKEN` está correto e se você ativou as credenciais de produção no Mercado Pago.

### "Site mostra mas presentes não aparecem"
→ Verifique se você rodou o SQL no Supabase pra criar as tabelas.

### "Depois do pagamento não volta pro site"
→ Você esqueceu de atualizar `NEXT_PUBLIC_SITE_URL` no passo 8.

---

## 🆘 PRECISA DE AJUDA?

1. Revise cada passo com calma
2. Confira se todas as variáveis de ambiente estão corretas
3. Olhe os logs na Vercel (aba "Deployments" → clica no deploy → "Function Logs")

---

✅ **PRONTO!** Seu site está no ar em `https://SEU-DOMINIO.vercel.app`

Compartilhe esse link com os convidados! 🎉
