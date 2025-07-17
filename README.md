# 📧 Email Sender - Node.js + Oracle

Este projeto foi desenvolvido em Node.js para automatizar o envio de e-mails de notificação sobre documentos próximos do vencimento, integrando com banco de dados Oracle (TASY).

Fui responsável por:
- Desenvolver toda a parte Node.js
- Parametrizar e integrar a função PL/SQL `enviar_email` no TASY
- Estruturar a consulta de documentos e lógica de prioridade
- Empacotar o projeto para execução via `.exe` em VM

## ✨ Funcionalidades
- Consulta periódica de documentos perto do vencimento
- Envio de e-mail para setores específicos (Compras ou SESMT)
- Lógica de prioridade baseada na data de vencimento
- Agendamento via `node-cron`
- Configuração externa (.env) para dados sensíveis

---

## ⚙️ Requisitos

- Node.js (v18+)
- Oracle Instant Client (Basic ou Basic Light)
- Microsoft Visual C++ Redistributable x64

- Comando para gerar EXECUTÁVEL:
  npx pkg . --targets node18-win-x64 --output email_sender.exe

