import { NextRequest, NextResponse } from 'next/server';

import { sendNotification } from '@/core/features/statistics/actions';
import { APIResponseData, APIResult } from '@/core/types';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<APIResult<APIResponseData>>> {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
  };

  const body = await request.json();
  const { appId, text, token } = body;
  const errMsg = 'Unable to send notification';

  if (!appId || !text || !token) {
    return NextResponse.json(
      {
        data: null,
        error: `${errMsg}. Invalid request body`,
      },
      { headers: corsHeaders }
    );
  }

  try {
    const sent = await sendNotification(appId, text);
    if (!sent) {
      return NextResponse.json(
        {
          data: null,
          error: errMsg,
        },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        data: {
          success: true,
          message: 'Notification sent',
        },
      },
      { headers: corsHeaders }
    );
  } catch (err: unknown) {
    console.error(`POST api/<v>/notifications ${err}`);
    return NextResponse.json(
      {
        data: null,
        error: errMsg,
      },
      { headers: corsHeaders }
    );
  }
}
