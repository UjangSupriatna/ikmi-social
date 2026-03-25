# IKMI SOCIAL - Panduan Instalasi Lengkap

## 📋 Persyaratan Sistem

Pastikan komputer Anda sudah terinstall:
- **Node.js** v18 atau lebih baru - [Download Node.js](https://nodejs.org/)
- **Git** - [Download Git](https://git-scm.com/downloads)
- **Text Editor** (disarankan VS Code) - [Download VS Code](https://code.visualstudio.com/)

## 🚀 Langkah Instalasi

### 1. Clone Repository

Buka terminal/command prompt, lalu jalankan:

```bash
# Clone repository dari GitHub
git clone https://github.com/UjangSupriatna/ikmi-social.git

# Masuk ke folder project
cd ikmi-social
```

### 2. Install Dependencies

```bash
# Install semua package yang diperlukan
npm install
```

### 3. Setup Environment Variables

Buat file `.env` di root folder project:

```bash
# Windows (Command Prompt)
copy .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env

# Jika tidak ada .env.example, buat manual:
notepad .env
```

Isi file `.env` dengan:

```env
# Database
DATABASE_URL="file:./db/dev.db"

# NextAuth Configuration
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

**Generate NEXTAUTH_SECRET:**

```bash
# Opsi 1: Menggunakan Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Opsi 2: Menggunakan OpenSSL
openssl rand -hex 32

# Opsi 3: Online generator
# Kunjungi: https://generate-secret.vercel.app/32
```

### 4. Setup Database

```bash
# Generate Prisma Client
npx prisma generate

# Membuat database dan tables
npx prisma db push
```

### 5. Jalankan Aplikasi

```bash
# Jalankan development server
npm run dev
```

Buka browser dan akses: **http://localhost:3000**

---

## 🔧 Menjalankan Chat Service (Real-time Messaging)

Untuk fitur chat real-time, jalankan chat service di terminal terpisah:

```bash
# Terminal baru - Chat Service
cd ikmi-social/mini-services/chat-service
npm install
npm run dev
```

Chat service akan berjalan di port **3003**

**Tanpa chat service**, aplikasi tetap bisa berjalan tapi chat tidak akan real-time (hanya polling).

---

## 📁 Struktur Folder

```
ikmi-social/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   └── page.tsx           # Main application page
│   ├── components/            # React Components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── layout/           # Layout components
│   │   ├── events/           # Event-related components
│   │   ├── friends/          # Friend system components
│   │   ├── groups/           # Group components
│   │   ├── messages/         # Messaging components
│   │   ├── post/             # Post components
│   │   └── profile/          # Profile components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility functions
│   └── stores/               # Zustand stores
├── prisma/
│   └── schema.prisma         # Database schema
├── db/
│   └── dev.db               # SQLite database
├── mini-services/
│   └── chat-service/        # Real-time chat service
└── .env                     # Environment variables
```

---

## 🗄️ Database Management

### Membuka Prisma Studio

```bash
npx prisma studio
```

Prisma Studio akan terbuka di browser untuk mengelola database secara visual.

### Reset Database

```bash
# Hapus semua data dan reset database
npx prisma db push --force-reset
```

---

## 🌙 Dark Mode

Aplikasi mendukung dark mode secara otomatis mengikuti pengaturan sistem. Untuk mengubah manual:
- Klik avatar/profile di sidebar kiri
- Pilih "Settings" atau tema

---

## 📱 Fitur Utama

1. **Authentication**
   - Register & Login
   - Session management dengan NextAuth.js

2. **Profile**
   - Edit profile (nama, bio, avatar)
   - CV Section (Education, Experience, Achievements, Portfolio)

3. **Posts**
   - Create, edit, delete posts
   - Like, comment, share
   - Image upload

4. **Friends**
   - Add friends
   - Friend suggestions
   - Friend requests

5. **Groups**
   - Create & join groups
   - Group posts
   - Group members

6. **Events**
   - Create events
   - RSVP (going, interested)
   - Event categories

7. **Messages**
   - Real-time chat (dengan socket.io)
   - Image sharing
   - Read receipts

8. **Notifications**
   - Friend requests
   - Likes & comments
   - Event reminders

---

## 🐛 Troubleshooting

### Error: "Cannot find module"

```bash
# Hapus node_modules dan install ulang
rm -rf node_modules
rm package-lock.json
npm install
```

### Error: "Database error"

```bash
# Reset database
npx prisma db push --force-reset
```

### Error: "Port 3000 already in use"

```bash
# Windows - Cari proses yang menggunakan port
netstat -ano | findstr :3000

# Kill proses (ganti PID dengan angka dari hasil di atas)
taskkill /PID <PID> /F
```

### Chat tidak real-time

Pastikan chat service berjalan:
```bash
cd mini-services/chat-service
npm run dev
```

---

## 🔐 Security Notes

1. **JANGAN** commit file `.env` ke GitHub
2. **JANGAN** gunakan NEXTAUTH_SECRET yang sama untuk production
3. Ubah file `.env` sesuai environment (development/production)

---

## 📞 Support

Jika ada masalah, hubungi:
- GitHub Issues: https://github.com/UjangSupriatna/ikmi-social/issues

---

## 📄 License

MIT License - Silakan gunakan untuk keperluan pembelajaran.
