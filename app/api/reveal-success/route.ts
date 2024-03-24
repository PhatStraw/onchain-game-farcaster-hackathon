import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

interface ExtendedFrameRequest extends FrameRequest {
    clientProtocol: `xmtp@${string}`; // Adjusted to match the expected type
}

async function getResponse(req: NextRequest): Promise<NextResponse> {
    // const validateFramesPost = (await import("@xmtp/frames-validator")).validateFramesPost;
    const body: FrameRequest = await req.json();
    // const extendedBody: ExtendedFrameRequest = { ...body, clientProtocol: `xmtp@yourProtocolVersion` };
    // const validatedData = await validateFramesPost(extendedBody);
    // if(!validatedData.verifiedWalletAddress){
    //     return new NextResponse('Message not valid', { status: 500 });
    // }
// Fix This Web3 wont load
//   const txHash =
//     body?.untrustedData?.transactionId ||
//     '0x33638327b2e288dbf1c74191b30c18aca0b81cfbff8a48fe7a9d04e0e1195172';
//     const receipt = await web3.eth.getTransactionReceipt(txHash);
//   if (!receipt) {
//     throw new Error(`Transaction receipt not found: ${JSON.stringify(web3)}`);
//   }
//   const boolValue = parseInt(receipt.logs[0]?.data || '', 16) === 1;

  const boolValue = true

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'link',
          label: boolValue ? 'You won! Based🔵 Click4Txn' : `You lost😬 Not Based. Click4Txn`,
          target: `https://basescan.org/tx/${"0x33638327b2e288dbf1c74191b30c18aca0b81cfbff8a48fe7a9d04e0e1195172"}`,
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
