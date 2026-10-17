# Agora Frontend

One role-based React application for all four operating realms:

- **Trader / desk** – trade entry, routed orders, blotter, holdings, P&L, cash, pricing, settlement and reports
- **Broker** – clients, enlistments, routing, fill attribution, exchange replica and settlement exposure
- **Exchange** – venues, instruments, securities, members, order book, depositories and delivery-versus-payment
- **Storage** – vaults, custody lots and append-only ownership transfers

## Setup

1. Set `VITE_API_URL` from `.env.example` if the API is not at `http://localhost:4000/api/v1`.
2. Run `npm install`.
3. Run `npm run dev`.

The login page asks only for username and password. The backend identifies whether the account is a Trader, Broker, Exchange, or Storage user and the frontend routes to the corresponding workspace. Traders receive account-scoped desk access.

## Quality commands

- `npm run build`
- `npm run lint`
