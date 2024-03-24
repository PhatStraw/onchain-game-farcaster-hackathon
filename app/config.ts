// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://onchain-game-farcaster-hackathon.vercel.app';
export const BUY_MY_COFFEE_CONTRACT_ADDR = '0x3bFC54c520BD1Df962bB5Ea3E9bd5ce89d8eb3C1';
