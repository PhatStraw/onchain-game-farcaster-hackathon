import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { Web3 }from 'web3';


async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
const web3 = new Web3('https://mainnet.base.org');

  const { isValid } = await getFrameMessage(body, {
    castReactionContext: true, 
  });

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }
  const revealAbi = {
    "constant": false,
    "inputs": [{"name": "secret", "type": "string"}],
    "name": "reveal",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
};


const txHash = body?.untrustedData?.transactionId || "0x33638327b2e288dbf1c74191b30c18aca0b81cfbff8a48fe7a9d04e0e1195172"
const receipt = await web3.eth.getTransactionReceipt(txHash);

const boolValue = web3.utils.hexToNumber(receipt.logs[0].data ? web3.utils.toHex(receipt.logs[0].data) : '0x0') === 1;
// const boolValue = true


  return new NextResponse(
    getFrameHtmlResponse({
        buttons: [
            {
                action: 'link',
                label: boolValue ? 'You won! Based🔵 Click4Txn' : `You lost😬 Not Based. Click4Txn`,
                target: `https://basescan.org/tx/${txHash}`,
              }
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