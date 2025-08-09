📧 Email Sender - Node.js + Oracle
This project is a Node.js application designed to automate the sending of email notifications for documents approaching their expiration date, with full integration to an Oracle database (TASY - Philips).

✨ Features
Periodic query of documents close to expiration

Email notifications sent to specific departments (Purchasing or SESMT)

Priority logic based on expiration dates

Scheduled execution using node-cron

External .env configuration for sensitive data

⚙️ Architecture
The application is structured to run scheduled tasks that query the Oracle database for documents nearing expiration. The results are processed according to a priority logic and then trigger an email sending process through the enviar_email PL/SQL function integrated with TASY.

npx pkg . --targets node18-win-x64 --output email_sender.exe
