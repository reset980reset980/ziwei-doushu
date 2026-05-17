import { STAR_DESCRIPTIONS } from './constants';

export type TopicKey =
  | 'overview'
  | 'personality'
  | 'love'
  | 'career'
  | 'wealth'
  | 'health'
  | 'family'
  | 'children'
  | 'move'
  | 'friends'
  | 'home'
  | 'spirit'
  | 'parents';

export const TOPIC_LABEL: Record<TopicKey, string> = {
  overview: '명반 개요',
  personality: '성향',
  love: '관계/혼인',
  career: '직업',
  wealth: '재물',
  health: '건강',
  family: '형제/가족',
  children: '자녀',
  move: '이동/외부',
  friends: '교우',
  home: '주거/부동산',
  spirit: '복덕',
  parents: '부모',
};

export const TOPIC_PALACE_NAME: Record<TopicKey, string> = {
  overview: '命',
  personality: '命',
  love: '夫妻',
  career: '官禄',
  wealth: '财帛',
  health: '疾厄',
  family: '兄弟',
  children: '子女',
  move: '迁移',
  friends: '交友',
  home: '田宅',
  spirit: '福德',
  parents: '父母',
};

type StarProfile = {
  mingGong: string;
  personality: string;
  xiongDi: string;
  fuQi: string;
  ziNv: string;
  caiBo: string;
  jiE: string;
  qianYi: string;
  jiaoYou: string;
  guanLu: string;
  tianZhai: string;
  fuDe: string;
  fuMu: string;
};

const topicGuide: Record<keyof StarProfile, string> = {
  mingGong: '명궁에서는 선천 기질, 삶의 중심축, 판단 방식으로 드러납니다.',
  personality: '성향 해석에서는 말투, 결단, 관계 거리감, 반복되는 선택 습관을 봅니다.',
  xiongDi: '형제/가족 영역에서는 가까운 사람과 자원이나 책임을 나누는 방식을 봅니다.',
  fuQi: '관계와 혼인에서는 끌림의 방식, 갈등 패턴, 오래 유지되는 조건을 봅니다.',
  ziNv: '자녀와 후배 영역에서는 돌봄, 책임, 아래 세대와의 연결 방식을 봅니다.',
  caiBo: '재물궁에서는 돈을 버는 방식, 돈이 새는 지점, 축적의 리듬을 봅니다.',
  jiE: '건강궁에서는 무리하기 쉬운 생활 패턴과 관리해야 할 신체 리듬을 봅니다.',
  qianYi: '이동/외부 영역에서는 밖에서 만나는 기회, 이주, 출장, 외부 평판을 봅니다.',
  jiaoYou: '교우궁에서는 친구, 동료, 고객, 협력자와의 상호작용을 봅니다.',
  guanLu: '직업궁에서는 일하는 방식, 조직 적합도, 책임을 맡는 분야를 봅니다.',
  tianZhai: '주거/부동산 영역에서는 생활 기반, 가족 공간, 자산 안정성을 봅니다.',
  fuDe: '복덕궁에서는 마음의 여유, 만족감, 오래 지속되는 행복 조건을 봅니다.',
  fuMu: '부모궁에서는 윗사람, 문서, 보호자, 제도권과의 관계를 봅니다.',
};

function content(star: string, field: keyof StarProfile) {
  const info = STAR_DESCRIPTIONS[star];
  const keywords = info?.keywords ?? '개성·변화·균형';
  const nature = info?.nature ?? '중성';
  const element = info?.element ?? '미상';
  const guide = topicGuide[field];

  return `**【一句话定调】**
${star}은 ${keywords}의 성질을 가진 별로, ${TOPIC_LABEL[fieldToTopic(field)]}에서는 그 에너지가 생활의 구체 영역으로 나타납니다.

**【核心论断】**
${guide} 별의 기본 성향은 ${nature}, 오행은 ${element}입니다. 좋은 구조에서는 강점이 선명해지고, 살성이나 화기가 겹치면 같은 성향이 부담으로 바뀔 수 있습니다.

**【命盘依据】**
실제 판단은 ${star}의 낙궁, 명궁과의 관계, 삼방사정, 사화, 대한/유년을 함께 대조해야 합니다.

**【经典出处】**
자미두수 14주성 체계와 12궁 해석 원리를 한국어 대시보드용으로 요약했습니다.`;
}

function fieldToTopic(field: keyof StarProfile): TopicKey {
  const map: Record<keyof StarProfile, TopicKey> = {
    mingGong: 'overview',
    personality: 'personality',
    xiongDi: 'family',
    fuQi: 'love',
    ziNv: 'children',
    caiBo: 'wealth',
    jiE: 'health',
    qianYi: 'move',
    jiaoYou: 'friends',
    guanLu: 'career',
    tianZhai: 'home',
    fuDe: 'spirit',
    fuMu: 'parents',
  };
  return map[field];
}

const fields: (keyof StarProfile)[] = [
  'mingGong',
  'personality',
  'xiongDi',
  'fuQi',
  'ziNv',
  'caiBo',
  'jiE',
  'qianYi',
  'jiaoYou',
  'guanLu',
  'tianZhai',
  'fuDe',
  'fuMu',
];

export const STAR_DB: Record<string, StarProfile> = Object.fromEntries(
  Object.keys(STAR_DESCRIPTIONS).map((star) => [
    star,
    Object.fromEntries(fields.map((field) => [field, content(star, field)])) as StarProfile,
  ]),
);
