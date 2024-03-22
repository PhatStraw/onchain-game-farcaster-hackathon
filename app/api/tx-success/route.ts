import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';

async function getResponse(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();

  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: '86611592-8905-4E36-B537-F642BF3A081F', allowFramegear: true, });


  if (!isValid) {
    return new NextResponse('Message not valid', { status: 500 });
  }

  let state = {
    page: 0,
  };
  try {
    state = JSON.parse(decodeURIComponent(message.state?.serialized));
  } catch (e) {
    console.error(e);
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          action: 'tx',
          label: 'Rock',
          target: `${NEXT_PUBLIC_URL}/api/makemove?choice=1`,
          postUrl: `${NEXT_PUBLIC_URL}/api/confirmmove?choice=1`,
        },
        {
          action: 'tx',
          label: 'Paper',
          target: `${NEXT_PUBLIC_URL}/api/makemove?choice=2`,
          postUrl: `${NEXT_PUBLIC_URL}/api/confirmmove?choice=1`,
        },
        {
          action: 'tx',
          label: 'Scissors',
          target: `${NEXT_PUBLIC_URL}/api/makemove?choice=3`,
          postUrl: `${NEXT_PUBLIC_URL}/api/confirmmove?choice=1`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/park-1.png`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
      state: {
        page: state?.page + 1,
        time: new Date().toISOString(),
      },
    }),
  );

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Tx: ${body?.untrustedData?.transactionId || '--'}`,
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
