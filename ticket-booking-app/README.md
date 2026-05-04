# Ticket Booking App

Full-stack internal department event ticket booking system.

## Features
- React frontend with advanced responsive UI
- Spring Boot REST backend
- MySQL database
- JWT authentication
- Role-based dashboards: STUDENT and ADMIN
- OTP verification flow
- Booking validation and ticket stock update
- Chatbot endpoint
- Venue map

## Local Run

### Database
```sql
CREATE DATABASE ticket_booking_db;
SOURCE database/schema.sql;
SOURCE database/seed.sql;
```

### Backend
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Default flow
1. Register as STUDENT.
2. Login.
3. Book ticket.
4. OTP will be sent by mail if SMTP is configured. Otherwise check backend console for `DEV OTP`.
5. Register as ADMIN to open `/admin`.

## GitHub Push
```bash
git init
git add .
git commit -m "Ticket booking app with authentication and dashboard"
git branch -M main
git remote add origin https://github.com/vajralavenkatasivaprasad/ticket-booking-app.git
git push -u origin main
```

## Deployment
Frontend: Netlify / Vercel. Backend: Render / Railway. Database: Railway MySQL / Aiven MySQL.
