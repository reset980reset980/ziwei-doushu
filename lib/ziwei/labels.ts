const PALACE_LABELS: Record<string, string> = {
  '命宫': '명궁',
  '命': '명궁',
  '兄弟宫': '형제궁',
  '兄弟': '형제궁',
  '夫妻宫': '부처궁',
  '夫妻': '부처궁',
  '子女宫': '자녀궁',
  '子女': '자녀궁',
  '财帛宫': '재백궁',
  '财帛': '재백궁',
  '疾厄宫': '질액궁',
  '疾厄': '질액궁',
  '迁移宫': '천이궁',
  '迁移': '천이궁',
  '仆役宫': '노복궁',
  '仆役': '노복궁',
  '交友宫': '교우궁',
  '交友': '교우궁',
  '官禄宫': '관록궁',
  '官禄': '관록궁',
  '田宅宫': '전택궁',
  '田宅': '전택궁',
  '福德宫': '복덕궁',
  '福德': '복덕궁',
  '父母宫': '부모궁',
  '父母': '부모궁',
};

export function palaceLabel(name: string) {
  return PALACE_LABELS[name] ?? name;
}

export function trimPalace(name: string) {
  return palaceLabel(name).replace(/궁$/, '');
}

const STAR_LABELS: Record<string, string> = {
  '紫微': '자미',
  '天机': '천기',
  '太阳': '태양',
  '武曲': '무곡',
  '天同': '천동',
  '廉贞': '염정',
  '天府': '천부',
  '太阴': '태음',
  '贪狼': '탐랑',
  '巨门': '거문',
  '天相': '천상',
  '天梁': '천량',
  '七杀': '칠살',
  '破军': '파군',
  '文昌': '문창',
  '文曲': '문곡',
  '左辅': '좌보',
  '右弼': '우필',
  '天魁': '천괴',
  '天钺': '천월',
  '禄存': '녹존',
  '天马': '천마',
  '擎羊': '경양',
  '陀罗': '타라',
  '火星': '화성',
  '铃星': '영성',
  '地空': '지공',
  '地劫': '지겁',
};

const SIHUA_LABELS: Record<string, string> = {
  '禄': '록',
  '权': '권',
  '科': '과',
  '忌': '기',
  '化禄': '화록',
  '化权': '화권',
  '化科': '화과',
  '化忌': '화기',
};

const STEM_LABELS = ['갑', '을', '병', '정', '무', '기', '경', '신', '임', '계'];
const BRANCH_LABELS = ['자', '축', '인', '묘', '진', '사', '오', '미', '신', '유', '술', '해'];

const BRANCH_PALACE_LABELS: Record<string, string> = {
  '子宫': '자궁',
  '丑宫': '축궁',
  '寅宫': '인궁',
  '卯宫': '묘궁',
  '辰宫': '진궁',
  '巳宫': '사궁',
  '午宫': '오궁',
  '未宫': '미궁',
  '申宫': '신궁',
  '酉宫': '유궁',
  '戌宫': '술궁',
  '亥宫': '해궁',
};

const PHRASE_OVERRIDES: Array<[string, string]> = [
  [
    '巨门太阳同寅宫，太阳化解巨门暗曜，主以口才、传媒、外语、专业立业。寅宫为佳，申宫力减。怕巨门化忌则官非。',
    '거문과 태양이 인궁에 함께 있어 태양이 거문의 어두운 기운을 덜어 줍니다. 말, 미디어, 외국어, 전문기술로 입지를 세우기 쉽습니다. 인궁은 좋고 신궁은 힘이 줄며, 거문 화기가 겹치면 구설이나 법적 분쟁을 조심해야 합니다.',
  ],
  [
    '巨门太阳同申宫，太阳化解巨门暗曜，主以口才、传媒、外语、专业立业。寅宫为佳，申宫力减。怕巨门化忌则官非。',
    '거문과 태양이 신궁에 함께 있어 말과 전문성으로 길을 여는 구조입니다. 다만 인궁보다 힘이 약하므로 표현, 계약, 법적 분쟁을 더 조심해야 합니다.',
  ],
  ['巨门太阳同入寅宫', '거문·태양이 인궁에 함께 들어감'],
  ['巨门太阳同入申宫', '거문·태양이 신궁에 함께 들어감'],
  ['寅宫太阳庙旺，巨门得日光化解是非', '인궁의 태양이 밝아 거문의 시비성을 완화함'],
  [
    '太阴化忌坐迁移宫，外出、远行、人际关系易有波折，宜守不宜动。',
    '태음 화기가 천이궁에 있어 외출, 장거리 이동, 대인관계에 굴곡이 생기기 쉬우므로 무리한 확장보다 안정 운용이 좋습니다.',
  ],
  ['太阴化忌坐迁宫', '태음 화기가 천이궁에 자리함'],
  ['《紫微斗数全书·巨日同宫》', '《자미두수전서 · 거일동궁》'],
  ['《紫微斗数全书》', '《자미두수전서》'],
  ['《紫微斗数全集》', '《자미두수전집》'],
  ['《紫微斗数骨髓赋》', '《자미두수 골수부》'],
  ['《骨髓赋》', '《골수부》'],
];

const TERM_LABELS: Record<string, string> = {
  ...PALACE_LABELS,
  ...STAR_LABELS,
  ...SIHUA_LABELS,
  ...BRANCH_PALACE_LABELS,
  '巨日同宫': '거일동궁',
  '水二局': '수 2국',
  '木三局': '목 3국',
  '金四局': '금 4국',
  '土五局': '토 5국',
  '火六局': '화 6국',
  '日月同宫': '일월동궁',
  '日月夹命': '일월협명',
  '机月同梁': '기월동량',
  '紫府同宫': '자부동궁',
  '府相朝垣': '부상조원',
  '阳梁昌禄': '양량창록',
  '火贪格': '화탐격',
  '铃贪格': '영탐격',
  '武贪格': '무탐격',
  '杀破狼': '살파랑',
  '廉贞天相格': '염정천상격',
  '武曲七杀格': '무곡칠살격',
  '同宫': '동궁',
  '入命': '명궁에 들어감',
  '坐命': '명궁에 자리함',
  '命宫三方四正': '명궁 삼방사정',
  '三方四正': '삼방사정',
  '会照': '회조',
  '庙旺': '묘왕',
  '落陷': '낙함',
  '化解': '완화',
  '官非': '관재/법적 분쟁',
  '口才': '말솜씨',
  '传媒': '미디어',
  '外语': '외국어',
  '专业': '전문성',
  '立业': '직업 기반 형성',
  '远行': '장거리 이동',
  '人际关系': '대인관계',
  '波折': '굴곡',
  '宜守不宜动': '무리한 이동보다 안정 운용이 좋음',
  '主': '주로',
  '古书云': '고전에서는',
  '出处': '출처',
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function starLabel(name: string) {
  return STAR_LABELS[name] ?? name;
}

export function siHuaLabel(name: string) {
  return SIHUA_LABELS[name] ?? name;
}

export function stemLabel(index: number) {
  return STEM_LABELS[index] ?? '';
}

export function branchLabel(index: number) {
  return BRANCH_LABELS[index] ?? '';
}

export function ganZhiLabel(stemIndex: number, branchIndex: number) {
  return `${stemLabel(stemIndex)}${branchLabel(branchIndex)}`;
}

export function koreanizeZiweiText(value: string | undefined | null) {
  if (!value) return '';

  let text = value;
  for (const [source, target] of PHRASE_OVERRIDES) {
    text = text.split(source).join(target);
  }

  const entries = Object.entries(TERM_LABELS).sort((a, b) => b[0].length - a[0].length);
  for (const [source, target] of entries) {
    text = text.replace(new RegExp(escapeRegExp(source), 'g'), target);
  }

  return text
    .replace(/、/g, ', ')
    .replace(/，/g, ', ')
    .replace(/。/g, '. ')
    .replace(/；/g, '; ')
    .replace(/：「/g, ': "')
    .replace(/」/g, '"')
    .replace(/「/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}
