import { NextResponse } from 'next/server';
import { generateChart } from '@/lib/ziwei/algorithm';
import type { BirthInfo } from '@/lib/ziwei/types';

function isBirthInfo(value: Partial<BirthInfo>): value is BirthInfo {
  return (
    Number.isInteger(value.year) &&
    Number.isInteger(value.month) &&
    Number.isInteger(value.day) &&
    Number.isInteger(value.hour) &&
    (value.gender === 'male' || value.gender === 'female')
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!isBirthInfo(body)) {
      return NextResponse.json({ error: '생년월일, 시각, 성별을 확인해 주세요.' }, { status: 400 });
    }

    const chart = generateChart(body);
    return NextResponse.json(chart);
  } catch (error) {
    const message = error instanceof Error ? error.message : '명반 생성에 실패했습니다.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
