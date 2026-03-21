# 🚀 Shortcut Vault

> **The community-driven vault for time-saving shortcuts and software tricks.**

![Shortcut Vault Preview](https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=1200)

Shortcut Vault is a premium, high-performance platform built for professionals who want to master their workflow. Whether you're a designer in **Figma**, a writer in **Word**, or a data analyst in **Excel**, our community-curated collection of shortcuts will help you work faster and smarter.

## ✨ Features

- 💎 **Premium Glassmorphism UI**: A stunning, modern interface designed for focus.
- ⌨️ **Interactive Shortcut Cards**: Visual keyboard keys that make learning intuitive.
- 🔍 **Dynamic Search & Filtering**: Find exactly what you need in milliseconds.
- ⚡ **One-Click Copy**: Instantly copy complex formulas or shortcut combinations.
- 🗳️ **Community Voting**: Mark shortcuts as "Helpful" to highlight the best tricks.
- 📥 **Contribution Portal**: Easily "dump" your own shortcuts to help the community.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: Inter (Google Fonts)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/shortcut-vault.git
cd shortcut-vault
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Run the SQL scripts located in the `supabase/` directory in your Supabase SQL Editor:
1. `schema.sql` - Sets up tables and RLS policies.
2. `seed.sql` - Populates the vault with initial shortcuts.

### 5. Run the dev server
```bash
npm run dev
```

## 🤝 Contributing

We love shortcuts! If you have a hidden trick or a life-saving formula, feel free to contribute:
1. Fork the repo.
2. Create your feature branch (`git checkout -b feature/AmazingShortcut`).
3. Commit your changes (`git commit -m 'Add new Figma shortcut'`).
4. Push to the branch (`git push origin feature/AmazingShortcut`).
5. Open a Pull Request.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Built with ❤️ by the **Antigravity** team.
