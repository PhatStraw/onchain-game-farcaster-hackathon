// use NODE_ENV to not have to change config based on where it's deployed
export const NEXT_PUBLIC_URL =
  process.env.NODE_ENV == 'development' ? 'http://localhost:3000' : 'https://onchain-game-farcaster-hackathon.vercel.app';
export const BUY_MY_COFFEE_CONTRACT_ADDR = '0x8Ef3e139Ae44D20B25a013a7896Bfa4B45ad8518';
