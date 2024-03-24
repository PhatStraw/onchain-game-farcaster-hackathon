import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {

  const body: FrameRequest = await req.json();
  const ethers = await import('ethers');
  // Replace the Web3 initialization with ethers
  const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');
  // Dynamically import ethers

  const { isValid } = await getFrameMessage(body, {
    castReactionContext: true,
  });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const txHash =
    body?.untrustedData?.transactionId ||
    '0x33638327b2e288dbf1c74191b30c18aca0b81cfbff8a48fe7a9d04e0e1195172';
  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt) {
    console.log(provider);
    throw new Error(`Transaction receipt not found: ${JSON.stringify(ethers)}`);
  }
  const boolValue = parseInt(receipt.logs[0]?.data || '', 16) === 1;
  // const boolValue = true

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'link',
          label: boolValue ? 'You won! Based🔵 Click4Txn' : `You lost😬 Not Based. Click4Txn`,
          target: `https://basescan.org/tx/${txHash}`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/park-4.png`,
      },
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
