/**
 * 名人命盘数据库
 * 基于公开记录的出生日期，时辰为估算值（部分有文献记载）
 */

export interface FamousPerson {
  id: string;
  name: string;
  category: '비즈니스' | '예술' | '역사' | '스포츠' | '기술';
  description: string;           // 一句话身份介绍
  year: number;
  month: number;
  day: number;
  hour: number;                  // 时辰地支索引 0-11
  gender: 'male' | 'female';
  notable: string;               // 命盘亮点提示（启发用户兴趣）
}

export const FAMOUS_PERSONS: FamousPerson[] = [
  // ─── 商业传奇 ─────────────────────────────────────────────
  {
    id: 'ma-yun',
    name: '마윈',
    category: '비즈니스',
    description: '알리바바 창업자',
    year: 1964, month: 9, day: 10, hour: 5,  // 约午时
    gender: 'male',
    notable: '파격과 재구성의 힘이 강하게 보이며, 관록궁 별 배치가 인터넷 비즈니스 제국과 잘 맞물립니다.',
  },
  {
    id: 'li-jiacheng',
    name: '리카싱',
    category: '비즈니스',
    description: '홍콩 기업가, 청쿵그룹 창업자',
    year: 1928, month: 7, day: 29, hour: 3,  // 约寅时
    gender: 'male',
    notable: '재백궁과 사화가 재물 축적 사례로 볼 만하며, 녹존의 보존력이 두드러집니다.',
  },
  {
    id: 'ren-zhengfei',
    name: '런정페이',
    category: '비즈니스',
    description: '화웨이 창업자',
    year: 1944, month: 10, day: 25, hour: 3, // 寅时
    gender: 'male',
    notable: '칠살 입명 구조로 역풍 속에서 강해지는 흐름이 뚜렷한 사례입니다.',
  },

  // ─── 文艺名人 ─────────────────────────────────────────────
  {
    id: 'zhang-ailing',
    name: '장아이링',
    category: '예술',
    description: '중국 현대문학 작가',
    year: 1920, month: 9, day: 30, hour: 1, // 丑时
    gender: 'female',
    notable: '고독한 별 조합이 감정사와 문학적 성취의 결을 함께 보여 줍니다.',
  },
  {
    id: 'jay-chou',
    name: '저우제룬',
    category: '예술',
    description: '중화권 대중음악 가수',
    year: 1979, month: 1, day: 18, hour: 1,  // 丑时（据报道夜间出生）
    gender: 'male',
    notable: '문곡과 탐랑의 조합으로 재능, 표현력, 대중성이 강하게 드러납니다.',
  },
  {
    id: 'wang-fei',
    name: '왕페이',
    category: '예술',
    description: '중화권 대표 여성 가수',
    year: 1969, month: 8, day: 8, hour: 4,   // 卯时
    gender: 'female',
    notable: '부처궁 별 배치가 관계 흐름과 맞물려 연구 가치가 있습니다.',
  },
  {
    id: 'lin-zhiling',
    name: '린즈링',
    category: '예술',
    description: '대만 모델 겸 배우',
    year: 1974, month: 11, day: 29, hour: 5, // 午时
    gender: 'female',
    notable: '태음 수명의 부드러운 매력과 이미지성이 잘 드러나는 사례입니다.',
  },

  // ─── 科技精英 ─────────────────────────────────────────────
  {
    id: 'steve-jobs',
    name: '스티브 잡스',
    category: '기술',
    description: '애플 공동 창업자',
    year: 1955, month: 2, day: 24, hour: 6,  // 午时
    gender: 'male',
    notable: '파군 입명 구조로 기존 질서를 깨고 새 판을 만드는 흐름이 강합니다.',
  },
  {
    id: 'elon-musk',
    name: '일론 머스크',
    category: '기술',
    description: '테슬라, SpaceX 창업자',
    year: 1971, month: 6, day: 28, hour: 4,  // 卯时
    gender: 'male',
    notable: '살파랑 구조와 이동성이 강해 개척, 확장, 경계 돌파의 상징성이 큽니다.',
  },

  // ─── 体育明星 ─────────────────────────────────────────────
  {
    id: 'yao-ming',
    name: '야오밍',
    category: '스포츠',
    description: 'NBA 센터, 중국 농구 대표 인물',
    year: 1980, month: 9, day: 12, hour: 5,  // 午时
    gender: 'male',
    notable: '천량 수명의 무게감과 관록궁 흐름이 직업적 성취와 잘 맞습니다.',
  },
  {
    id: 'li-na',
    name: '리나',
    category: '스포츠',
    description: '중국 테니스 그랜드슬램 우승자',
    year: 1982, month: 2, day: 26, hour: 2,  // 寅时
    gender: 'female',
    notable: '칠살의 경쟁성이 강하며, 승부와 돌파의 흐름을 보기 좋은 사례입니다.',
  },
];

/** 按分类获取名人 */
export function getFamousByCategory(category: FamousPerson['category']): FamousPerson[] {
  return FAMOUS_PERSONS.filter(p => p.category === category);
}

/** 获取所有分类 */
export const FAMOUS_CATEGORIES: FamousPerson['category'][] = [
  '비즈니스', '예술', '기술', '스포츠',
];
