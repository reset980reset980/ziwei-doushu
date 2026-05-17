import type { BirthFormState } from '@/components/BirthForm';
import type { BirthInfo } from './types';
import { lunar2solar, solar2lunar } from 'iztro/lib/calendar/convertor';

/** KST 표준 경도(동경 135도) 기준 진태양시 분 단위를 계산한다. */
function calcTrueSolarMinutes(clockHour: number, clockMinute: number, longitude: number): number {
  const clockMins = clockHour * 60 + clockMinute;
  const offset = (longitude - 135) * 4;
  return ((clockMins + offset) % 1440 + 1440) % 1440;
}

/** KST 표준 경도(동경 135도) 기준 진태양시 시지를 계산한다. */
export function calcTrueSolarBranch(clockHour: number, clockMinute: number, longitude: number): number {
  const solar = calcTrueSolarMinutes(clockHour, clockMinute, longitude);
  if (solar >= 1380 || solar < 60) return 0;
  return Math.floor((solar - 60) / 120) + 1;
}

function isLateZiHour(clockHour: number, clockMinute: number, longitude: number): boolean {
  return calcTrueSolarMinutes(clockHour, clockMinute, longitude) >= 1380;
}

function nextCalendarDay(
  y: number,
  m: number,
  d: number,
  calendarType: BirthFormState['calendarType'],
  isLeapMonth: boolean,
) {
  if (calendarType === 'lunar') {
    const solar = lunar2solar(`${y}-${m}-${d}`, isLeapMonth);
    const nextSolar = new Date(solar.solarYear, solar.solarMonth - 1, solar.solarDay + 1);
    const lunar = solar2lunar(nextSolar);
    return {
      y: lunar.lunarYear,
      m: lunar.lunarMonth,
      d: lunar.lunarDay,
      isLeapMonth: lunar.isLeap,
    };
  }

  const next = new Date(y, m - 1, d + 1);
  return {
    y: next.getFullYear(),
    m: next.getMonth() + 1,
    d: next.getDate(),
    isLeapMonth: false,
  };
}

/** BirthFormState → BirthInfo
 *
 * 子时规则（倪海厦体系/三合派标准）：
 * · 23:00-23:59 = 晚子时，**按次日**排盘（日期 +1）
 * · 00:00-00:59 = 早子时，按本日排盘
 * 这与「时辰支同为子(0)」并不冲突——子时分早晚两段，需要在日期上区分。
 */
export function formToBirthInfo(form: BirthFormState): BirthInfo {
  let y = parseInt(form.year) || 0;
  let m = parseInt(form.month) || 0;
  let d = parseInt(form.day) || 0;
  let isLeapMonth = form.calendarType === 'lunar' ? form.isLeapMonth : false;

  // 만자시(진태양시 23:00-23:59)는 다음 날짜로 본다.
  // 직접 입력, 공유 URL, 기록 복원, 합반이 모두 이 함수만 쓰도록 맞춰 결과 차이를 막는다.
  if (!form.unknownTime) {
    const clockHour = parseInt(form.clockHour) || 0;
    const clockMinute = parseInt(form.clockMinute) || 0;
    if (isLateZiHour(clockHour, clockMinute, form.longitude) && y > 0 && m > 0 && d > 0) {
      const next = nextCalendarDay(y, m, d, form.calendarType, isLeapMonth);
      y = next.y;
      m = next.m;
      d = next.d;
      isLeapMonth = next.isLeapMonth;
    }
  }

  const hour = form.unknownTime
    ? 0
    : calcTrueSolarBranch(parseInt(form.clockHour) || 0, parseInt(form.clockMinute) || 0, form.longitude);
  return {
    year: y, month: m, day: d,
    hour,
    gender: form.gender,
    calendarType: form.calendarType ?? 'solar',
    isLeapMonth: form.calendarType === 'lunar' ? isLeapMonth : undefined,
    name: form.name || undefined,
    province: form.province || undefined,
    city: form.city || undefined,
    longitude: form.province ? form.longitude : undefined,
  };
}

/** BirthFormState → URLSearchParams（用于分享链接） */
export function formToSearchParams(form: BirthFormState): URLSearchParams {
  const p = new URLSearchParams();
  if (form.name) p.set('n', form.name);
  p.set('y', form.year);
  p.set('m', form.month);
  p.set('d', form.day);
  if (form.calendarType === 'lunar') p.set('cal', 'lunar');
  if (form.isLeapMonth) p.set('leap', '1');
  if (form.unknownTime) {
    p.set('u', '1');
  } else {
    p.set('h', form.clockHour);
    p.set('mi', form.clockMinute);
  }
  if (form.province) p.set('p', form.province);
  if (form.city) p.set('c', form.city);
  if (form.longitude && form.longitude !== 126.98) p.set('lo', String(form.longitude));
  p.set('g', form.gender === 'male' ? 'm' : 'f');
  return p;
}

/** URLSearchParams → Partial<BirthFormState>，不完整时返回 null */
export function searchParamsToForm(params: URLSearchParams): Partial<BirthFormState> | null {
  const year = params.get('y');
  const month = params.get('m');
  const day = params.get('d');
  if (!year || !month || !day) return null;
  return {
    name: params.get('n') || '',
    year,
    month,
    day,
    calendarType: params.get('cal') === 'lunar' ? 'lunar' : 'solar',
    isLeapMonth: params.get('leap') === '1',
    unknownTime: params.get('u') === '1',
    clockHour: params.get('h') || '8',
    clockMinute: params.get('mi') || '0',
    province: params.get('p') || '',
    city: params.get('c') || '',
    longitude: parseFloat(params.get('lo') || '126.98'),
    gender: params.get('g') === 'f' ? 'female' : 'male',
  };
}
