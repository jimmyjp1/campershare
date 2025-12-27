# Credentials & Configuration

## Alle Zugangsdaten für Projektpartner

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
Password: *****
SMTP Server: smtp-mail.outlook.com
Port: 587
TLS: enabled
```

### Stripe Payment (Test-Modus)
```
Publishable Key: pk****************************************************************************************************
Secret Key: sk*********************************************************************************************************
Webhook Secret: whsec_**************************
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
App-Password: ******
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
