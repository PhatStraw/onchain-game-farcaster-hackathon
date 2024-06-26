import { FrameRequest, getFrameMessage } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';
import { base } from 'viem/chains';
import BuyMeACoffeeABI from '../../_contracts/BuyMeACoffeeABI';
import { BUY_MY_COFFEE_CONTRACT_ADDR } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';
const crypto = require('crypto');

function generateHash(secret: any) {
    const hash = crypto.createHash('sha256');
    hash.update(secret);
    return hash.digest('hex');
}
async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  const searchParams = req.nextUrl.searchParams
  const choice = searchParams.get('choice')
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: '86611592-8905-4E36-B537-F642BF3A081F', allowFramegear: true, });
  const secret = choice + "-" + message?.interactor.custody_address;
  const hash = generateHash(secret);
  const hash_secret = hash.startsWith('0x') ? hash : "0x" + hash;
  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const data = encodeFunctionData({
    abi: BuyMeACoffeeABI,
    functionName: 'play',
    args: [hash_secret],
  });

  const txData: FrameTransactionResponse = {
    chainId: `eip155:${base.id}`, // Remember Base Sepolia might not work on Warpcast yet
    method: 'eth_sendTransaction',
    params: {
      abi: [],
      data,
      to: BUY_MY_COFFEE_CONTRACT_ADDR,
      value: parseEther('0.00').toString(), // 0.00004 ETH
    },
  };
  return NextResponse.json(txData);
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
