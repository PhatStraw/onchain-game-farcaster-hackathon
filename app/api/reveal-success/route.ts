import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
const { Web3 } = require('web3');

async function getResponse(req: NextRequest): Promise<NextResponse> {
    
    const web3 = new Web3('https://base-mainnet.g.alchemy.com/v2/iDFf5eN_U6n_FW4zKq2U8n0M6feutYwx');
    console.log('Web3 initialized', web3);
    
    const body: FrameRequest = await req.json();
    console.log('Request body:', body);
    
    const { isValid } = await getFrameMessage(body, {
      castReactionContext: true,
    });
    console.log('Message validity:', isValid);
    

    if (!isValid) {
      console.error('Message not valid');
      return new NextResponse('Message not valid', { status: 500 });
    }
    
    const txHash = body?.untrustedData?.transactionId || '0x33638327b2e288dbf1c74191b30c18aca0b81cfbff8a48fe7a9d04e0e1195172';
    console.log('Transaction hash:', txHash);
    
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    console.log('Transaction receipt:', receipt);
    
    if (!receipt) {
      console.error(`Transaction receipt not found for hash: ${txHash}`);
      throw new Error(`Transaction receipt not found: ${JSON.stringify(web3)}`);
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
