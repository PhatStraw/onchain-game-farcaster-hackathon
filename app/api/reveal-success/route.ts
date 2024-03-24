import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
const { Web3 } = require('web3');

async function getResponse(req: NextRequest): Promise<NextResponse> {
    
  const web3 = new Web3('https://base-mainnet.g.alchemy.com/v2/iDFf5eN_U6n_FW4zKq2U8n0M6feutYwx');
  const body: FrameRequest = await req.json();

  const { isValid } = await getFrameMessage(body, {
    castReactionContext: true,
  });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  const txHash =
    body?.untrustedData?.transactionId ||
    '0x33638327b2e288dbf1c74191b30c18aca0b81cfbff8a48fe7a9d04e0e1195172';
    const receipt = await web3.eth.getTransactionReceipt(txHash);
  if (!receipt) {
    throw new Error(`Transaction receipt not found: ${JSON.stringify(web3)}`);
  }
  const boolValue = parseInt(receipt.logs[0]?.data || '', 16) === 1;
//   const boolValue = true

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
