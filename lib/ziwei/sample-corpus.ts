import { createGunzip } from 'node:zlib';
import { createReadStream, existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { Readable } from 'node:stream';
import type { BirthInfo, Palace, ZiweiChart } from './types';
import { STAR_DESCRIPTIONS } from './constants';
import { branchLabel, koreanizeZiweiText, palaceLabel, starLabel } from './labels';
import type { TopicKey } from './db-analysis';

const DEFAULT_DATA_DIR = '/home/reset980/ziwei-data/ziwei-samples-v3';
const DEFAULT_ZIP_PATH = `${DEFAULT_DATA_DIR}/ziwei-samples-toolkit-v3-full.zip`;

const topicQuestionMap: Array<[TopicKey, RegExp]> = [
  ['wealth', /재물|돈|금전|수입|투자|사업|財|wealth/i],
  ['career', /직업|일|커리어|사업|관록|官|career|work/i],
  ['love', /연애|결혼|혼인|배우자|관계|부처|夫妻|love/i],
  ['health', /건강|질병|수술|몸|질액|疾|health/i],
  ['move', /이동|이사|외부|해외|천이|迁|move/i],
  ['friends', /친구|동료|인맥|교우|노복|仆|friend/i],
  ['home', /집|부동산|전택|田|home/i],
  ['children', /자녀|아이|후배|子女|children/i],
  ['family', /형제|가족|兄弟|family/i],
  ['parents', /부모|윗사람|문서|父母|parents/i],
  ['spirit', /복덕|마음|정신|행복|福德|spirit/i],
  ['personality', /성격|성향|기질|personality/i],
];

const topicLabel: Record<TopicKey, string> = {
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

const topicPalace: Record<TopicKey, string> = {
  overview: '命宫',
  personality: '命宫',
  love: '夫妻宫',
  career: '官禄宫',
  wealth: '财帛宫',
  health: '疾厄宫',
  family: '兄弟宫',
  children: '子女宫',
  move: '迁移宫',
  friends: '仆役宫',
  home: '田宅宫',
  spirit: '福德宫',
  parents: '父母宫',
};

const sourceSectionLabels: Record<string, string> = {
  命格总览: '명반 총론',
  性格特质: '성향 특질',
  感情婚姻: '관계와 혼인',
  事业发展: '직업과 진로',
  财运走势: '재물 흐름',
  健康疾厄: '건강과 질액',
  兄弟家庭: '형제와 가족',
  子女缘分: '자녀와 후배',
  迁移外出: '이동과 외부 활동',
  人际贵人: '인맥과 귀인',
  田宅不动产: '주거와 부동산',
  精神福德: '복덕과 마음',
  父母长辈: '부모와 윗사람',
  命盘关键定制: '명반 핵심 맞춤',
  命盘特殊格局: '명반 특수 격국',
  星曜深层特质: '성요 심층 특질',
  命盘推演: '명반 추론',
  三方四正联动: '삼방사정 연동',
  本命四化会照: '본명 사화 회조',
  贵人倾向·魁钺细分: '귀인 경향과 천괴·천월',
  综合建议: '종합 조언',
  继续深度追问: '계속 심층 질문',
};

interface SampleRecord {
  birthInfo: BirthInfo;
  chart: ZiweiChart;
  topics: Partial<Record<TopicKey, string>>;
  system?: string;
}

const sampleCache = new Map<string, SampleRecord | null>();

function corpusZipPath() {
  return process.env.ZIWEI_SAMPLE_ZIP || DEFAULT_ZIP_PATH;
}

function corpusDir() {
  return process.env.ZIWEI_SAMPLE_DIR || `${DEFAULT_DATA_DIR}/samples-out`;
}

function sampleKey(birthInfo: BirthInfo) {
  const year = birthInfo.solarYear ?? birthInfo.year;
  const month = birthInfo.solarMonth ?? birthInfo.month;
  const day = birthInfo.solarDay ?? birthInfo.day;
  return `${year}-${month}-${day}-${birthInfo.hour}-${birthInfo.gender}`;
}

function monthPath(birthInfo: BirthInfo) {
  const year = birthInfo.solarYear ?? birthInfo.year;
  const month = birthInfo.solarMonth ?? birthInfo.month;
  const monthText = String(month).padStart(2, '0');
  return {
    year,
    month,
    file: `${year}-${monthText}.jsonl.gz`,
    zipEntry: `ziwei-samples-toolkit/samples-out/year-${year}/${year}-${monthText}.jsonl.gz`,
    extracted: `${corpusDir()}/year-${year}/${year}-${monthText}.jsonl.gz`,
  };
}

function openSampleStream(birthInfo: BirthInfo): Readable | null {
  const target = monthPath(birthInfo);
  if (existsSync(target.extracted)) {
    return createReadStream(target.extracted).pipe(createGunzip());
  }

  const zip = corpusZipPath();
  if (!existsSync(zip)) return null;

  const unzip = spawn('unzip', ['-p', zip, target.zipEntry], { stdio: ['ignore', 'pipe', 'ignore'] });
  return unzip.stdout.pipe(createGunzip());
}

function matchesBirthInfo(sample: SampleRecord, birthInfo: BirthInfo) {
  const year = birthInfo.solarYear ?? birthInfo.year;
  const month = birthInfo.solarMonth ?? birthInfo.month;
  const day = birthInfo.solarDay ?? birthInfo.day;
  return (
    sample.birthInfo?.year === year &&
    sample.birthInfo?.month === month &&
    sample.birthInfo?.day === day &&
    sample.birthInfo?.hour === birthInfo.hour &&
    sample.birthInfo?.gender === birthInfo.gender
  );
}

export function getSampleCorpusStatus() {
  const zip = corpusZipPath();
  const dir = corpusDir();
  return {
    available: existsSync(zip) || existsSync(dir),
    zip,
    dir,
  };
}

export async function findSampleForBirthInfo(birthInfo: BirthInfo) {
  const key = sampleKey(birthInfo);
  if (sampleCache.has(key)) return sampleCache.get(key) ?? null;

  const stream = openSampleStream(birthInfo);
  if (!stream) {
    sampleCache.set(key, null);
    return null;
  }

  const rl = createInterface({ input: stream, crlfDelay: Infinity });
  try {
    for await (const line of rl) {
      if (!line.trim()) continue;
      const sample = JSON.parse(line) as SampleRecord;
      if (matchesBirthInfo(sample, birthInfo)) {
        sampleCache.set(key, sample);
        return sample;
      }
    }
  } catch {
    sampleCache.set(key, null);
    return null;
  }

  sampleCache.set(key, null);
  return null;
}

export function inferTopicFromQuestion(question: string): TopicKey {
  const normalized = question.trim();
  const matched = topicQuestionMap.find(([, pattern]) => pattern.test(normalized));
  return matched?.[0] ?? 'overview';
}

function normalizePalaceName(name: string) {
  return name.endsWith('宫') ? name : `${name}宫`;
}

function findPalace(chart: ZiweiChart, palaceName: string) {
  return chart.palaces.find((palace) => normalizePalaceName(palace.name) === palaceName);
}

function formatStars(palace?: Palace) {
  if (!palace) return '확인되지 않음';
  const majors = palace.stars.filter((star) => star.type === 'major');
  if (!majors.length) {
    const borrowed = palace.borrowedStars?.map(starLabel).join(', ');
    return borrowed ? `공궁, 대궁 ${borrowed} 차성` : '공궁';
  }
  return majors
    .map((star) => `${starLabel(star.name)}${star.siHua ? ` ${koreanizeZiweiText(`化${star.siHua}`)}` : ''}`)
    .join(', ');
}

function starGuidance(palace?: Palace) {
  const majors = palace?.stars.filter((star) => star.type === 'major') ?? [];
  if (!majors.length && palace?.borrowedStars?.length) {
    return `이 궁은 공궁이므로 대궁의 ${palace.borrowedStars.map(starLabel).join(', ')}을 빌려 판단합니다. 사건은 직접 치고 들어오기보다 상대 궁의 조건을 통해 드러납니다.`;
  }
  if (!majors.length) return '주성이 없는 공궁이라 대궁, 삼방사정, 사화가 판단의 중심입니다.';

  return majors
    .map((star) => {
      const info = STAR_DESCRIPTIONS[star.name];
      const base = info
        ? `${starLabel(star.name)}은 ${info.keywords} 성향의 별입니다.`
        : `${starLabel(star.name)}은 이 궁의 주된 작동 방식을 보여 줍니다.`;
      const sihua = star.siHua ? ` ${koreanizeZiweiText(`化${star.siHua}`)}가 붙어 이 별의 작용이 더 선명하게 드러납니다.` : '';
      return `${base}${sihua}`;
    })
    .join('\n');
}

function extractPatternNames(raw = '') {
  const names = Array.from(raw.matchAll(/⭐\s+\*\*([^*：:]+)[：:]/g)).map((match) => cleanKoreanLabel(match[1]));
  return Array.from(new Set(names)).slice(0, 6);
}

function extractSihuaNames(raw = '') {
  const names = Array.from(raw.matchAll(/[🟢🔵🟡🔴]\s+\*\*([^*]+)\*\*/g)).map((match) => cleanKoreanLabel(match[1]));
  return Array.from(new Set(names)).slice(0, 6);
}

function cleanKoreanLabel(input: string) {
  const pretranslated = input
    .replace(/本命/g, '본명')
    .replace(/命盘/g, '명반')
    .replace(/财运/g, '재물')
    .replace(/事业/g, '직업')
    .replace(/感情/g, '관계')
    .replace(/健康/g, '건강')
    .replace(/迁移/g, '이동')
    .replace(/父母/g, '부모')
    .replace(/兄弟/g, '형제')
    .replace(/子女/g, '자녀')
    .replace(/田宅/g, '전택')
    .replace(/福德/g, '복덕')
    .replace(/仆役/g, '노복')
    .replace(/当前/g, '현재')
    .replace(/大限/g, '대한')
    .replace(/岁/g, '세')
    .replace(/运势/g, '운세')
    .replace(/关键/g, '핵심')
    .replace(/定制/g, '맞춤')
    .replace(/特殊/g, '특수')
    .replace(/格局/g, '격국')
    .replace(/星曜/g, '성요')
    .replace(/深层/g, '심층')
    .replace(/特质/g, '특질')
    .replace(/推演/g, '추론')
    .replace(/联动/g, '연동')
    .replace(/会照/g, '회조')
    .replace(/贵人/g, '귀인')
    .replace(/倾向/g, '경향')
    .replace(/细分/g, '세분')
    .replace(/综合/g, '종합')
    .replace(/建议/g, '조언')
    .replace(/继续/g, '계속')
    .replace(/深度/g, '심층')
    .replace(/追问/g, '질문')
    .replace(/财/g, '재물')
    .replace(/官/g, '직업')
    .replace(/命/g, '명')
    .replace(/盘/g, '반')
    .replace(/宫/g, '궁')
    .replace(/魁钺/g, '천괴·천월');

  return koreanizeZiweiText(pretranslated)
    .replace(/本/g, '본')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractSourceSections(raw = '') {
  const sections = Array.from(raw.matchAll(/\*\*【([^】]+)】\*\*/g))
    .map((match) => sourceSectionLabels[match[1]] ?? cleanKoreanLabel(match[1]))
    .filter((label) => !/[\u4e00-\u9fff]/.test(label));
  return Array.from(new Set(sections)).slice(0, 8);
}

export function buildSampleBackedKoreanInterpretation(sample: SampleRecord, topic: TopicKey, latestQuestion = '') {
  const chart = sample.chart;
  const rawTopic = sample.topics[topic] || sample.topics.overview || '';
  const palaceName = topicPalace[topic];
  const palace = findPalace(chart, palaceName);
  const ming = findPalace(chart, '命宫');
  const current = chart.daXians[chart.currentDaXianIndex];
  const patterns = extractPatternNames(rawTopic);
  const sihuas = extractSihuaNames(rawTopic);
  const sections = extractSourceSections(rawTopic);
  const focus = latestQuestion.replace(/\s+/g, ' ').slice(0, 120);

  return `**【v3 샘플 데이터 연동】**
원본 51만+ 샘플 코퍼스에서 ${chart.birthInfo.year}-${chart.birthInfo.month}-${chart.birthInfo.day} ${chart.birthInfo.hour}시 ${chart.birthInfo.gender === 'male' ? '남성' : '여성'} 명반을 찾아 ${topicLabel[topic]} 주제로 재구성했습니다. 원문은 중국어 JSONL이지만 화면에는 한국어 해석만 노출합니다.

**【명반 핵심】**
명궁은 ${formatStars(ming)}이고, 오행국은 ${koreanizeZiweiText(chart.wuxingJuName)}입니다. ${palaceLabel(palaceName)}의 주성은 ${formatStars(palace)}입니다. ${palace ? `${palaceLabel(palace.name)}은 ${branchLabel(palace.branch)}궁에 놓여 있습니다.` : '해당 궁을 찾지 못해 명궁과 삼방사정 중심으로 봅니다.'}

**【${topicLabel[topic]} 판단】**
${starGuidance(palace)}

${topic === 'overview' ? '전체 명반은 명궁만 보지 않고 재백궁, 관록궁, 천이궁을 함께 엮어 봅니다. 샘플 데이터도 본궁, 대궁, 삼방사정, 사화, 현재 대한을 함께 사용해 해석을 구성합니다.' : `${topicLabel[topic]}은 ${palaceLabel(palaceName)} 하나만으로 단정하지 않고 명궁과 대궁, 삼방사정의 연결로 판단합니다. 좋은 별은 강점으로 쓰고, 화기나 살성이 붙은 별은 관리해야 할 과제로 봅니다.`}

**【샘플에서 잡힌 격국/강조점】**
${patterns.length ? patterns.map((name) => `- ${name}`).join('\n') : '- 원본 샘플에서 별도 대격국 표지가 강하게 추출되지는 않았습니다. 궁의 주성과 사화 중심으로 판단합니다.'}

**【사화와 현재 대한】**
${sihuas.length ? sihuas.map((name) => `- ${name}`).join('\n') : '- 이 주제의 원본 topic에서 전면에 드러난 사화 표지는 제한적입니다.'}
${current ? `현재 대한은 ${current.startAge}-${current.endAge}세, ${palaceLabel(current.palaceName)}입니다. 이 시기에는 해당 궁의 사건이 현실 흐름으로 더 크게 올라옵니다.` : '현재 대한 정보는 샘플에서 확인되지 않았습니다.'}

**【원본 근거 구조】**
샘플 topic은 ${sections.length ? sections.join(' · ') : '명반 핵심, 삼방사정, 사화, 종합 조언'} 구조를 포함합니다. 앱에서는 이 구조를 유지하되 중국어 원문 문장을 그대로 붙이지 않고 한국어 판단문으로 정리했습니다.${focus ? ` 질문 초점은 "${focus}"로 반영했습니다.` : ''}`;
}
