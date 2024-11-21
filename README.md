## This template provides a minimal setup to get Next.js working with MiniKit

## Setup

```bash
cp .env.example .env
pnpm i
pnpm dev

```

To run as a mini app choose a production app in the dev portal and use NGROK to tunnel. Set the `NEXTAUTH_URL` and the redirect url if using sign in with worldcoin to that ngrok url

Environment file - create .env from .env.example

`APP_ID` and `WLD_CLIENT_ID` is just your app ID from World Dev Portal

`WLD_CLIENT_SECRET` is also from World Dev Portal

`NEXTAUTH_URL` is where your app is hosted. eg: `https://XXXXYYYY.ngrok-free.app` if using ngrok free above

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

View docs: [Docs](https://docs.world.org/mini-apps)

[Developer Portal](https://developer.worldcoin.org/)
