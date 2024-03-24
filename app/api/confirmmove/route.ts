import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { encodeFunctionData, parseEther } from 'viem';
import { base } from 'viem/chains';
import BuyMeACoffeeABI from '../../_contracts/BuyMeACoffeeABI';
import { BUY_MY_COFFEE_CONTRACT_ADDR } from '../../config';
import type { FrameTransactionResponse } from '@coinbase/onchainkit/frame';
import { NEXT_PUBLIC_URL } from '../../config';


async function getResponse(req: NextRequest): Promise<NextResponse | Response> {
  const body: FrameRequest = await req.json();
  const searchParams = req.nextUrl.searchParams
  const choice = searchParams.get('choice')
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: '86611592-8905-4E36-B537-F642BF3A081F', allowFramegear: true, });
console.log("confirm move", message)

  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }
  

    return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
            action: 'tx',
            label: 'Confirm Move',
            target: `${NEXT_PUBLIC_URL}/api/reveal?choice=${message.button}`,
            postUrl: `${NEXT_PUBLIC_URL}/api/reveal-success`,
          },
       
      ],
     
      image: {
        src: `${NEXT_PUBLIC_URL}/park-1.png`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
