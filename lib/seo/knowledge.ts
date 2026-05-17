/**
 * SEO 知识页 — 数据 helper
 *
 * 14 主星 × 13 topic = 182 个独立 SEO URL
 * 每页都是 STAR_DB 中对应字段的 4 段 markers（一句话定调/核心论断/命盘依据/经典出处）
 */

import { STAR_DB } from '@/lib/ziwei/db-analysis';
import type { TopicKey } from '@/lib/ziwei/db-analysis';
import { TOPIC_PALACE_NAME, TOPIC_LABEL } from '@/lib/ziwei/db-analysis';

export const ALL_STARS = [
  '紫微', '天机', '太阳', '武曲', '天同', '廉贞', '天府',
  '太阴', '贪狼', '巨门', '天相', '天梁', '七杀', '破军',
];

// 主星名 ↔ 拼音 slug 映射（URL 用 slug，避免中文 URL 在 Vercel/CDN 上的边界问题）
export const STAR_TO_SLUG: Record<string, string> = {
  '紫微': 'ziwei',
  '天机': 'tianji',
  '太阳': 'taiyang',
  '武曲': 'wuqu',
  '天同': 'tiantong',
  '廉贞': 'lianzhen',
  '天府': 'tianfu',
  '太阴': 'taiyin',
  '贪狼': 'tanlang',
  '巨门': 'jumen',
  '天相': 'tianxiang',
  '天梁': 'tianliang',
  '七杀': 'qisha',
  '破军': 'pojun',
};

export const SLUG_TO_STAR: Record<string, string> = Object.fromEntries(
  Object.entries(STAR_TO_SLUG).map(([k, v]) => [v, k])
);

export const ALL_TOPICS: TopicKey[] = [
  'overview', 'personality', 'love', 'career', 'wealth', 'health',
  'family', 'children', 'move', 'friends', 'home', 'spirit', 'parents',
];

interface StarContent {
  mingGong: string;
  personality: string;
  xiongDi?: string;
  fuQi: string;
  ziNv?: string;
  caiBo: string;
  jiE: string;
  qianYi?: string;
  jiaoYou?: string;
  guanLu: string;
  tianZhai?: string;
  fuDe?: string;
  fuMu?: string;
}

const TOPIC_TO_FIELD: Record<TopicKey, keyof StarContent> = {
  overview:    'mingGong',
  personality: 'personality',
  love:        'fuQi',
  career:      'guanLu',
  wealth:      'caiBo',
  health:      'jiE',
  family:      'xiongDi' as keyof StarContent,
  children:    'ziNv' as keyof StarContent,
  move:        'qianYi' as keyof StarContent,
  friends:     'jiaoYou' as keyof StarContent,
  home:        'tianZhai' as keyof StarContent,
  spirit:      'fuDe' as keyof StarContent,
  parents:     'fuMu' as keyof StarContent,
};

interface ParsedContent {
  dingdiao: string;
  lundian: string;
  yiju: string;
  chuchu: string;
  raw: string;
  hasMarkers: boolean;
}

function parseStarContent(content: string): ParsedContent {
  const out: ParsedContent = { dingdiao: '', lundian: '', yiju: '', chuchu: '', raw: content, hasMarkers: false };
  if (!content) return out;
  if (!content.includes('**【一句话定调】**') && !content.includes('**【核心论断】**')) {
    out.lundian = content;
    return out;
  }
  out.hasMarkers = true;
  const re = /\*\*【([^】]+)】\*\*/g;
  const parts: { name: string; markerEnd: number; start: number }[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(content)) !== null) {
    parts.push({ name: m[1], start: m.index, markerEnd: m.index + m[0].length });
  }
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    const end = i + 1 < parts.length ? parts[i + 1].start : content.length;
    const text = content.slice(p.markerEnd, end).trim();
    if (p.name === '一句话定调') out.dingdiao = text;
    else if (p.name === '核心论断') out.lundian = text;
    else if (p.name === '命盘依据') out.yiju = text;
    else if (p.name === '经典出处') out.chuchu = text;
  }
  return out;
}

export interface KnowledgeData {
  star: string;
  topic: TopicKey;
  topicLabel: string;
  palaceName: string;
  parsed: ParsedContent;
  exists: boolean;
}

export function getKnowledge(star: string, topic: TopicKey): KnowledgeData {
  const profile = STAR_DB[star] as StarContent | undefined;
  const field = TOPIC_TO_FIELD[topic];
  const content = profile && field ? (profile[field] as string | undefined) ?? '' : '';
  return {
    star,
    topic,
    topicLabel: TOPIC_LABEL[topic],
    palaceName: TOPIC_PALACE_NAME[topic],
    parsed: parseStarContent(content),
    exists: Boolean(content),
  };
}

/** 生成所有 14×13 组合（用于 generateStaticParams） */
export function getAllKnowledgeRoutes() {
  const routes: { star: string; slug: string; topic: TopicKey }[] = [];
  for (const star of ALL_STARS) {
    for (const topic of ALL_TOPICS) {
      const data = getKnowledge(star, topic);
      if (data.exists) routes.push({ star, slug: STAR_TO_SLUG[star], topic });
    }
  }
  return routes;
}

/** 主星属性简介（用于 SEO 页"了解 XX 星"section） */
export const STAR_BRIEF_SEO: Record<string, string> = {
  '紫微': '자미는 중심성과 권위를 뜻하는 별입니다. 명궁에 있으면 리더십, 독립성, 큰 조직과의 인연이 강해집니다.',
  '天机': '천기는 지혜와 기획의 별입니다. 변화에 민감하고 판단이 빠르며, 보좌, 전략, 기술, 연구에 잘 맞습니다.',
  '太阳': '태양은 명예와 공적 활동의 별입니다. 밝고 외향적인 힘이 있어 공직, 교육, 미디어, 대외 활동에 유리합니다.',
  '武曲': '무곡은 재물과 실행력의 별입니다. 결단, 관리, 재무 감각이 강하고 금융, 실업, 기술 분야에 맞습니다.',
  '天同': '천동은 복덕과 온화함의 별입니다. 편안함, 안정, 서비스, 돌봄의 성향이 강하고 무리한 경쟁은 줄이는 편이 좋습니다.',
  '廉贞': '염정은 재능과 감정의 복합성이 큰 별입니다. 매력과 표현력이 강하지만 구설, 법적 문제, 감정 기복을 관리해야 합니다.',
  '天府': '천부는 재고와 안정의 별입니다. 보수적이고 신중하며 자산 보존, 부동산, 행정, 관리 영역에 강점이 있습니다.',
  '太阴': '태음은 섬세함과 축적형 재물의 별입니다. 감수성, 부동산, 가족 기반, 조용한 재물 운과 연결됩니다.',
  '贪狼': '탐랑은 욕망, 매력, 사교의 별입니다. 예술, 영업, 네트워크, 대중성과 인연이 크고 절제가 중요합니다.',
  '巨门': '거문은 말, 분석, 시비의 별입니다. 변론, 상담, 교육, 미디어에 강하지만 표현과 계약을 신중히 해야 합니다.',
  '天相': '천상은 보좌와 제도의 별입니다. 행정, 법무, 조직 운영, 조율 역할에 맞고 신뢰와 품위를 중시합니다.',
  '天梁': '천량은 보호와 어른의 별입니다. 의학, 법률, 교육, 종교, 공익 영역과 인연이 있으며 위기 완화력이 있습니다.',
  '七杀': '칠살은 결단과 돌파의 별입니다. 경쟁, 창업, 군경, 리스크가 있는 분야에 강하지만 고립과 급함을 조절해야 합니다.',
  '破军': '파군은 개혁과 재편의 별입니다. 기존 틀을 깨고 새 구조를 만드는 힘이 강해 기술, 개척, 변화 관리에 맞습니다.',
};
