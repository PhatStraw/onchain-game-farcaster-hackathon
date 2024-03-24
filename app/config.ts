// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://onchain-game-farcaster-hackathon.vercel.app';
export const BUY_MY_COFFEE_CONTRACT_ADDR = '0x9B0e852e86819012C1f330c158981A440bE6BB85';
