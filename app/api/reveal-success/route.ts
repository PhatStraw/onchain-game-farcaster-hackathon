import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const fetch = (await import('node-fetch')).default;
  async function getTransactionReceipt(txHash: string) {
    const response = await fetch(
      'https://base-mainnet.g.alchemy.com/v2/iDFf5eN_U6n_FW4zKq2U8n0M6feutYwx',
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          id: 8453,
          jsonrpc: '2.0',
          method: 'eth_getTransactionReceipt',
          params: [txHash],
        }),
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: any = await response.json();
    return data.result; // Assuming you want the 'result' part of the JSON response
  }

  const body: FrameRequest = await req.json();
  console.log('Request body:', body);

//   const { isValid } = await getFrameMessage(body, {
//     castReactionContext: true,
//   });
//   console.log('Message validity:', isValid);

//   if (!isValid) {
//     console.error('Message not valid');
//     return new NextResponse('Message not valid', { status: 500 });
//   }

  const txHash =
    body?.untrustedData?.transactionId ||
    '0x33638327b2e288dbf1c74191b30c18aca0b81cfbff8a48fe7a9d04e0e1195172';
  console.log('Transaction hash:', txHash);

  const receipt = await getTransactionReceipt(txHash);
  console.log('Transaction receipt:', receipt);

  if (!receipt) {
    console.error(`Transaction receipt not found for hash: ${txHash}`);
    throw new Error(`Transaction receipt not found: `);
  }

  const boolValue = parseInt(receipt.logs[0]?.data || '', 16) === 1;
  console.log('Boolean value from receipt:', boolValue);
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
