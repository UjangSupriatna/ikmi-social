# IKMI SOCIAL - Panduan Deployment ke Jagoan Hosting

## 📋 Persyaratan Server

- **Node.js**: v18.x atau lebih baru
- **MySQL**: 5.7 atau 8.x
- **PM2**: Untuk process management
- **Nginx**: Untuk reverse proxy (opsional tapi direkomendasikan)
- **RAM**: Minimal 512MB (1GB direkomendasikan)
- **Storage**: Minimal 1GB untuk aplikasi + storage upload

---

## 🚀 Langkah-langkah Deployment

### 1. Persiapan Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install MySQL (jika belum ada)
sudo apt install -y mysql-server

# Secure MySQL installation
sudo mysql_secure_installation
```

### 2. Setup Database MySQL

```bash
# Login ke MySQL
mysql -u root -p

# Buat database dan user
CREATE DATABASE ikmi_social CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ikmi_user'@'localhost' IDENTIFIED BY 'password_anda_yang_kuat';
GRANT ALL PRIVILEGES ON ikmi_social.* TO 'ikmi_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Clone dan Setup Aplikasi

```bash
# Clone repository
git clone https://github.com/UjangSupriatna/ikmi-real.git
cd ikmi-real

# Install dependencies dengan npm
npm install

# Copy environment file
cp .env.example .env

# Edit .env sesuai konfigurasi server
nano .env
```

### 4. Konfigurasi Environment (.env)

```env
# Database MySQL
DATABASE_URL="mysql://ikmi_user:password_anda@localhost:3306/ikmi_social"

# NextAuth
NEXTAUTH_SECRET="generate-dengan-openssl-rand-base64-32"
NEXTAUTH_URL="https://domain-anda.com"

# JWT Secret
JWT_SECRET="generate-dengan-openssl-rand-base64-32"

# App URL
NEXT_PUBLIC_APP_URL="https://domain-anda.com"
```

### 5. Setup Database Schema

```bash
# Generate Prisma Client
npm run db:generate

# Push schema ke database
npm run db:push
```

### 6. Build Aplikasi

```bash
# Build untuk production
npm run build
```

### 7. Jalankan dengan PM2

```bash
# Start aplikasi
npm run start:pm2

# Atau langsung dengan pm2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script (auto-start on boot)
pm2 startup
```

### 8. Setup Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt install -y nginx

# Buat konfigurasi site
sudo nano /etc/nginx/sites-available/ikmi-social
```

Konfigurasi Nginx:

```nginx
server {
    listen 80;
    server_name domain-anda.com www.domain-anda.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name domain-anda.com www.domain-anda.com;

    # SSL Configuration (gunakan Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/domain-anda.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/domain-anda.com/privkey.pem;

    # SSL Settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Upload size limit
    client_max_body_size 10M;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 60d;
        add_header Cache-Control "public, immutable, max-age=31536000";
    }

    # Upload files
    location /uploads {
        alias /var/www/ikmi-real/public/uploads;
        expires 30d;
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/ikmi-social /etc/nginx/sites-enabled/

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 9. Setup SSL dengan Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d domain-anda.com -d www.domain-anda.com

# Auto-renewal test
sudo certbot renew --dry-run
```

---

## 📁 Struktur Direktori

```
ikmi-real/
├── .next/                  # Build output
│   └── standalone/         # Production server
├── prisma/
│   └── schema.prisma       # Database schema
├── public/
│   └── uploads/            # User uploaded files
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # React components
│   └── lib/                # Utilities
├── logs/                   # Application logs
├── .env                    # Environment variables
├── ecosystem.config.js     # PM2 configuration
└── package.json
```

---

## 🔧 Perintah Berguna

```bash
# Restart aplikasi
npm run restart
# atau
pm2 restart ikmi-social

# Stop aplikasi
npm run stop
# atau
pm2 stop ikmi-social

# View logs
npm run logs
# atau
pm2 logs ikmi-social

# Monitor
pm2 monit

# Update aplikasi dari git
git pull origin main
npm install
npm run build
pm2 restart ikmi-social

# Database operations
npx prisma studio          # Buka Prisma Studio
npx prisma db push         # Push schema changes
```

---

## 🔒 Keamanan

1. **Firewall**: Pastikan hanya port 22, 80, 443 yang terbuka
2. **Database**: Gunakan password yang kuat untuk MySQL
3. **SSL**: Selalu gunakan HTTPS
4. **Updates**: Update sistem dan dependencies secara berkala
5. **Backup**: Backup database secara rutin

```bash
# Backup database
mysqldump -u ikmi_user -p ikmi_social > backup_$(date +%Y%m%d).sql

# Restore database
mysql -u ikmi_user -p ikmi_social < backup_20240101.sql
```

---

## ✅ Checklist Deployment

- [ ] Node.js terinstall (v18+)
- [ ] MySQL terinstall dan dikonfigurasi
- [ ] Database created
- [ ] .env dikonfigurasi dengan benar
- [ ] Dependencies installed (`npm install`)
- [ ] Prisma client generated (`npm run db:generate`)
- [ ] Schema pushed to database (`npm run db:push`)
- [ ] Build success (`npm run build`)
- [ ] PM2 running (`pm2 start ecosystem.config.js`)
- [ ] Nginx configured
- [ ] SSL installed
- [ ] Application accessible via browser

---

## 📞 Support

Jika mengalami masalah, cek:
1. PM2 logs: `pm2 logs ikmi-social`
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Application logs: `./logs/error.log`
