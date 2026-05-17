import type { ZiweiChart } from '@/lib/ziwei/types';
import { detectPatterns, getMingGongSummary } from '@/lib/ziwei/patterns';
import { koreanizeZiweiText, starLabel } from '@/lib/ziwei/labels';

export const runtime = 'nodejs';

function oneLine(chart: ZiweiChart) {
  const summary = getMingGongSummary(chart);
  const stars = summary.stars.length ? summary.stars.map(starLabel).join(', ') : '공궁';
  const patterns = detectPatterns(chart).slice(0, 2).map((p) => koreanizeZiweiText(p.name)).join(', ') || '특이 격국 없음';
  return `${chart.birthInfo.name ?? '대상'}: 명궁 ${stars}, ${chart.wuxingJuName}, 주요 격국 ${patterns}`;
}

function sse(text: string) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of text.match(/[\s\S]{1,80}/g) ?? ['']) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: chunk } })}\n\n`));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/event-stream; charset=utf-8' } });
}

export async function POST(request: Request) {
  const body = await request.json();
  const chartA = body.chartA as ZiweiChart | undefined;
  const chartB = body.chartB as ZiweiChart | undefined;
  if (!chartA || !chartB) return sse('두 명의 명반이 모두 필요합니다.');

  return sse(`**【합반 요약】**
${oneLine(chartA)}
${oneLine(chartB)}

**【관계 흐름】**
두 사람은 각자의 명궁 주성과 부처궁, 복덕궁을 함께 비교해야 합니다. 명궁 성향이 보완되면 협업과 관계 유지에 유리하고, 화기나 살성이 같은 생활 영역에 겹치면 반복 갈등이 생길 수 있습니다.

**【실전 조언】**
상대의 강점을 고치려 하지 말고 역할로 배치하세요. 감정 관계는 부처궁과 복덕궁, 동업 관계는 관록궁과 형제/교우궁을 중심으로 다시 확인하는 것이 좋습니다.`);
}
