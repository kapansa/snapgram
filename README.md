# Snapgram

A simple photo-sharing social app: people sign up, post pictures with captions, browse a feed, and visit each other's profiles. Built step by step as a hands-on way to learn a modern full-stack JavaScript setup.

<!-- Add screenshots here once you have them, for example:
![Feed](docs/screenshots/feed.png)
-->

## Features

- **Accounts**: sign up, log in, log out, and a full forgot/reset password flow
- **Posts**: upload a picture with an optional caption (images are stored in Cloudflare R2)
- **Feed**: newest posts from everyone, with the author, date, caption, and image
- **Profiles**: a page per user showing their details and a grid of their posts
- **Manage your posts**: edit captions and delete posts from a "..." menu on your own posts
- **Likes**: a like button that updates instantly (optimistic UI) and is enforced once per user in the database
- **Comments**: add comments on any post; delete your own, and post owners can delete any comment on their post
- **Settings**: change your profile picture, display name, and password
- **Polish**: Tailwind CSS v4 theming, Lucide icons, and Framer Motion animations that respect "reduce motion"

## Tech stack

| Area             | Tool                                                                           |
| ---------------- | ------------------------------------------------------------------------------ |
| Framework        | [Next.js](https://nextjs.org/) (App Router, Server Components, Server Actions) |
| Database         | PostgreSQL on [Neon](https://neon.com/)                                        |
| ORM              | [Prisma](https://www.prisma.io/) 7                                             |
| Authentication   | [Better Auth](https://www.better-auth.com/) (email and password)               |
| File storage     | [Cloudflare R2](https://developers.cloudflare.com/r2/) (S3-compatible)         |
| Email (optional) | [Resend](https://resend.com/)                                                  |
| Styling          | [Tailwind CSS](https://tailwindcss.com/) v4                                    |
| Icons            | [Lucide](https://lucide.dev/)                                                  |
| Animation        | [Framer Motion](https://www.framer.com/motion/)                                |

The project is written in JavaScript. Prisma's own config file is TypeScript, which is the only exception.

## Project structure

```
snapgram/
├── prisma/
│   ├── schema.prisma               # Models: Better Auth tables + Post, Like, Comment
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── api/auth/[...all]/      # Better Auth route handler
│   │   ├── forgot-password/
│   │   ├── login/
│   │   ├── profile/[id]/           # Dynamic profile pages
│   │   ├── reset-password/
│   │   ├── settings/
│   │   ├── signup/
│   │   ├── globals.css             # Tailwind v4 import and theme tokens
│   │   ├── layout.js
│   │   └── page.js                 # The feed
│   ├── actions/                    # Server actions: posts, likes, comments, profile
│   ├── components/                 # UI components (settings forms live in settings/)
│   └── lib/                        # auth, auth-client, prisma, r2, email, format
├── generated/                      # Prisma Client output (git-ignored)
└── next.config.mjs
```

## Getting started

### Prerequisites

- Node.js 20 or newer
- A free [Neon](https://neon.com/) account
- A [Cloudflare](https://www.cloudflare.com/) account with R2 enabled (Cloudflare may ask for a payment method; check the current R2 pricing and free allowance)
- Optional: a [Resend](https://resend.com/) account for real password-reset emails

### 1. Clone and install

```bash
git clone https://github.com/kapansa/snapgram.git
cd snapgram
npm install
```

### 2. Create your environment file

```bash
cp .env.example .env
```

Then fill in the values (see the table below). Never commit `.env`.

### 3. Set up the database (Neon)

1. Create a project at [neon.com](https://neon.com/).
2. Copy the connection string into `DATABASE_URL`.

### 4. Set up file storage (Cloudflare R2)

1. In the Cloudflare dashboard, open **R2 Object Storage** and create a bucket (choose any name you like).
2. In the bucket's **Settings**, enable the **Public Development URL** and copy it into `R2_PUBLIC_URL`.
3. Create an **API token** with **Object Read & Write** permission, scoped to that bucket. Copy the Access Key ID, Secret Access Key, and S3 endpoint into the matching variables. The endpoint must not include the bucket name.

### 5. Generate an auth secret

```bash
openssl rand -base64 32
```

Paste the result into `BETTER_AUTH_SECRET`.

### 6. Create the tables and generate the Prisma Client

```bash
npx prisma migrate dev
npx prisma generate
```

### 7. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account, and post something.

## Environment variables

| Variable               | Required | Description                                                         |
| ---------------------- | -------- | ------------------------------------------------------------------- |
| `DATABASE_URL`         | Yes      | Neon PostgreSQL connection string                                   |
| `BETTER_AUTH_SECRET`   | Yes      | Random secret used to sign sessions                                 |
| `BETTER_AUTH_URL`      | Yes      | Public URL of the app (`http://localhost:3000` locally)             |
| `R2_ENDPOINT`          | Yes      | R2 S3 API endpoint, without the bucket name                         |
| `R2_ACCESS_KEY_ID`     | Yes      | R2 API token access key                                             |
| `R2_SECRET_ACCESS_KEY` | Yes      | R2 API token secret                                                 |
| `R2_BUCKET_NAME`       | Yes      | Name of your R2 bucket                                              |
| `R2_PUBLIC_URL`        | Yes      | Public base URL for the bucket (no trailing slash)                  |
| `RESEND_API_KEY`       | No       | If empty, password-reset emails are printed in the terminal instead |
| `EMAIL_FROM`           | No       | Sender address for emails                                           |

None of these may start with `NEXT_PUBLIC_`. They are server-only secrets.

## Useful commands

| Command                                | What it does                                                 |
| -------------------------------------- | ------------------------------------------------------------ |
| `npm run dev`                          | Start the development server                                 |
| `npm run build`                        | Create a production build                                    |
| `npm run start`                        | Run the production build                                     |
| `npm run lint`                         | Run ESLint                                                   |
| `npx prisma migrate dev --name <name>` | Create and apply a migration after editing `schema.prisma`   |
| `npx prisma generate`                  | Regenerate the Prisma Client (run after every schema change) |
| `npx prisma studio`                    | Browse your database in the browser                          |

This project uses Prisma 7, where `migrate dev` does not regenerate the client automatically, so always run `npx prisma generate` after schema changes.

## How it works

- **Authentication**: Better Auth handles accounts and sessions and stores them in Postgres through Prisma. Server components read the session with `auth.api.getSession` to decide what to show.
- **Mutations**: posting, editing, deleting, liking, commenting, and profile changes are Next.js Server Actions in `src/actions/`. Each one checks the session and, where relevant, that the user owns the thing being changed. The author is always taken from the session, never from the browser.
- **Uploads**: images are validated (type and size), given random file names, and uploaded to R2 from the server. The database stores only the image URL. Replaced avatars and deleted posts also remove their files from R2.
- **Likes**: a join table with a composite primary key `(userId, postId)` makes double likes impossible at the database level.

## Known limitations

- The R2 "Public Development URL" is rate-limited and meant for development. For production, attach a custom domain to the bucket (and update `remotePatterns` in `next.config.mjs` if you use `next/image` optimization).
- Images are shown with `unoptimized` and cropped to a square.
- Likes and comments from other people appear after a refresh (nothing is real-time).
- The feed loads the latest 20 posts, and each post loads its latest 20 comments. There is no pagination yet.
- Changing your email address is not implemented.
- There are no automated tests yet.

## Privacy and legal notice

Snapgram is a learning project and comes with no guarantees. If you deploy it for real users, **you** are responsible for complying with the data protection laws that apply to you, including consent, registration, user rights, breach notification, and rules about where personal data is stored. In Zambia, for example, this means the Data Protection Act No. 3 of 2021. Nothing in this repository is legal advice.

## Security

Please do not open a public issue for security vulnerabilities. Use GitHub's **Report a vulnerability** option on the repository's Security tab instead.

## Contributing

Contributions are welcome.

1. Fork the repository and create a branch for your change.
2. Make your changes and run `npm run lint`.
3. If you change `prisma/schema.prisma`, include the generated migration.
4. Open a pull request describing what you changed and why.

Ideas that would make good first contributions: a bio on profiles, email change with confirmation, pagination, account deletion, natural image aspect ratios, and tests.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
