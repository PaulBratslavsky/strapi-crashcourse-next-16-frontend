/**
 * API route for provider connection redirect - migrated from TanStack Start
 */

import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: Promise<{ provider: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { provider } = await params;
  
  return NextResponse.json({ 
    message: `Connect ${provider} redirect - to be implemented`,
    provider 
  });
}