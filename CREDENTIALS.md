# Credentials & Configuration

## 🔐 Alle Zugangsdaten für Projektpartner

### Admin-Login
```
URL: http://localhost:3000/admin
Email: admin@campershare.com
Password: admin123
```

### Datenbank-Zugang
```
PostgreSQL:
Host: localhost
Port: 5432
Database: campershare
Username: campershare_user
Password: secure_password_123

PgAdmin Interface:
URL: http://localhost:8080
Email: admin@campershare.com
Password: admin123
```

### Email-System (Outlook SMTP)
```
Account: camper-shair@outlook.com
Password: !#CamperShair
SMTP Server: smtp-mail.outlook.com
Port: 587
TLS: enabled
```

### Stripe Payment (Test-Modus)
```
Publishable Key: pk_test_51QDPnhDhFBdKJl7XgJCfJPRmXh9j5YPCxXrBSKPZeqDDcCdyNdtYKkI3nPWzKE2sBkX6DqhZvP1LnkRAyKR3GBH000qwNSLBzm
Secret Key: sk_test_51QDPnhDhFBdKJl7XgkYKON20J7J7YzYdcwR8GdLHxrxCYTQhgqZcKWj1N2cYzQKNZhRBgwQcGZFfHl5YJJxdN2T700vYGRYjGL
Webhook Secret: whsec_[wird automatisch generiert]
```

### Test-Kreditkarten
```
Visa: 4242 4242 4242 4242
Mastercard: 5555 5555 5555 4444
American Express: 3782 822463 10005
Diners Club: 3056 930009 0259

CVV: 123
Ablaufdatum: 12/34
PLZ: beliebig
```

### Email-Provider Backup
```
Gmail Backup:
Account: campershare.backup@gmail.com
App-Password: [konfiguriert]

Yahoo Backup:  
Account: campershare.yahoo@yahoo.com
Password: [konfiguriert]
```

### Docker Container
```
App Container: campershare-app
Database: campershare-db
Cache: campershare-redis
Admin: campershare-pgadmin
```

### API-Endpoints
```
Base URL: http://localhost:3000/api
Campers: /api/campers
Bookings: /api/bookings
Payments: /api/payments
Email: /api/email
Admin: /api/admin
```

## ⚠️ Sicherheitshinweise

1. **Alle Credentials sind für Entwicklung/Test**
2. **Für Produktion alle Passwörter ändern**
3. **Stripe ist im Test-Modus - keine echten Zahlungen**
4. **Email-Accounts sind bereits funktional**

## 🔄 Status aller Services

✅ **Datenbank:** 19 Fahrzeuge vollständig konfiguriert
✅ **Email-System:** Getestet und funktional
✅ **Payment:** Stripe Test-Modus aktiv
✅ **Admin-Panel:** Vollständig funktionsfähig
✅ **Frontend:** Responsive Design mit allen Features

---

**Alle Systeme betriebsbereit!** 🎉
