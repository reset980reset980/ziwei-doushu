import type { ZiweiChart } from '@/lib/ziwei/types';
import { detectPatterns, getMingGongSummary } from '@/lib/ziwei/patterns';
import { branchLabel, ganZhiLabel, koreanizeZiweiText, palaceLabel, starLabel } from '@/lib/ziwei/labels';
import {
  buildSampleBackedKoreanInterpretation,
  findSampleForBirthInfo,
  getSampleCorpusStatus,
  inferTopicFromQuestion,
} from '@/lib/ziwei/sample-corpus';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

async function buildInterpretation(chart: ZiweiChart, latestQuestion = '') {
  const topic = inferTopicFromQuestion(latestQuestion);
  const sample = await findSampleForBirthInfo(chart.birthInfo);
  if (sample) {
    return buildSampleBackedKoreanInterpretation(sample, topic, latestQuestion);
  }

  const ming = getMingGongSummary(chart);
  const patterns = detectPatterns(chart).slice(0, 4);
  const current = chart.daXians[chart.currentDaXianIndex];
  const focus = latestQuestion.replace(/\s+/g, ' ').slice(0, 120);
  const corpus = getSampleCorpusStatus();

  const stars = ming.stars.length ? ming.stars.map(starLabel).join(', ') : '공궁(대궁 차성)';
  const keywords = ming.keywords.length ? ming.keywords.join(', ') : '균형, 관찰, 보완';
  const patternText = patterns.length
    ? patterns.map((p) => `- ${koreanizeZiweiText(p.name)}: ${koreanizeZiweiText(p.description)}`).join('\n')
    : '- 특별히 강하게 잡히는 대격은 적지만, 각 궁의 주성과 사화를 함께 봐야 합니다.';

  return `**【명반 핵심】**
명궁 주성은 ${stars}입니다. 핵심 키워드는 ${keywords}이며, ${chart.wuxingJuName}의 기질 위에서 삶의 방향이 잡힙니다.

**【v3 샘플 데이터 상태】**
원본 51만+ 샘플 코퍼스${corpus.available ? '는 서버에 연결되어 있지만, 이 생년월일시와 정확히 일치하는 샘플을 찾지 못했습니다' : '가 아직 서버 경로에 없습니다'}. 현재는 계산된 명반 구조와 한국어 해석 규칙으로 풀이합니다.

**【사주/자미두수 해석】**
이 대시보드는 사주팔자의 일간 중심 풀이가 아니라 자미두수 명반을 기준으로 봅니다. 생년월일시와 성별을 바탕으로 12궁, 주성, 보조성, 사화, 대한을 계산해 성향과 운의 흐름을 읽습니다.

**【현재 운세 구간】**
${current ? `현재 대한은 ${current.startAge}-${current.endAge}세, ${palaceLabel(current.palaceName)}입니다.` : '현재 대한 구간을 특정하지 못했습니다.'} 본명 명궁은 ${branchLabel(chart.mingGongBranch)}궁, 신궁은 ${branchLabel(chart.shenGongBranch)}궁이며 ${ganZhiLabel(chart.lunarInfo.yearStem, chart.lunarInfo.yearBranch)}년생 명반입니다.

**【감지된 격국】**
${patternText}

**【실전 조언】**
좋은 별과 격국은 강점으로 쓰고, 화기나 살성이 몰린 궁은 무리하지 않는 관리 영역으로 보세요. ${focus ? `질문 초점은 "${focus}"로 읽었습니다. ` : ''}구체 판단은 명궁, 재백궁, 관록궁, 부처궁, 복덕궁을 함께 대조할 때 정확도가 올라갑니다.`;
}

function sse(text: string) {
  const encoder = new TextEncoder();
  const chunks = text.match(/[\s\S]{1,80}/g) ?? [''];
  const stream = new ReadableStream({
    start(controller) {
      for (const chunk of chunks) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: { text: chunk } })}\n\n`));
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}

export async function POST(request: Request) {
  const body = await request.json();
  const chart = body.chart as ZiweiChart | undefined;
  const messages: ChatMessage[] = Array.isArray(body.messages) ? body.messages : [];
  const latest = [...messages].reverse().find((m) => m.role === 'user')?.content ?? '';

  if (!chart) {
    return sse('**【오류】**\n명반 데이터가 없어 해석을 만들 수 없습니다.');
  }

  return sse(await buildInterpretation(chart, latest));
}
