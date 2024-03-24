import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { Web3 }from 'web3';

const web3 = new Web3('https://mainnet.base.org');

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid } = await getFrameMessage(body);

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


const txHash = body?.untrustedData?.transactionId || "";
const receipt = await web3.eth.getTransactionReceipt(txHash);

const boolValue = receipt.logs[0]?.data ? web3.utils.hexToNumber(web3.utils.bytesToHex(receipt.logs[0].data)) === 1 : false;


  return new NextResponse(
    getFrameHtmlResponse({
        buttons: [
            {
                action: 'link',
                label: boolValue ? 'You won! Based. Click4Txn' : `You lost😬 Click4Txn`,
                target: `https://basescan.org/tx/${body?.untrustedData?.transactionId}`,
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