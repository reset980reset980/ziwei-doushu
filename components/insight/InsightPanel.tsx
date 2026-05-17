'use client';

import { useMemo } from 'react';
import type { Palace, Star, ZiweiChart } from '@/lib/ziwei/types';
import { detectPatterns, getMingGongSummary } from '@/lib/ziwei/patterns';
import type { TimeView } from '@/components/TimeNav';
import { branchLabel, ganZhiLabel, koreanizeZiweiText, palaceLabel, starLabel } from '@/lib/ziwei/labels';

export type FocusState =
  | { type: 'star'; label: string; star: Star; palace: Palace }
  | { type: 'palace'; label: string; palace: Palace }
  | { type: 'sihua'; label: string; siHua: string };

interface InsightPanelProps {
  chart: ZiweiChart;
  view: TimeView;
  liunianYear: number;
  liuyueMonth: number;
  focus: FocusState | null;
  onClearFocus: () => void;
}

const sectionStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--bdr)',
  borderRadius: 12,
  padding: 16,
};

function majorStars(palace?: Palace) {
  return palace?.stars.filter((star) => star.type === 'major').map((star) => starLabel(star.name)).join(', ') || '공궁';
}

export default function InsightPanel({ chart, view, liunianYear, liuyueMonth, focus, onClearFocus }: InsightPanelProps) {
  const ming = useMemo(() => getMingGongSummary(chart), [chart]);
  const patterns = useMemo(() => detectPatterns(chart), [chart]);
  const current = chart.daXians[chart.currentDaXianIndex];
  const palaces = {
    wealth: chart.palaces.find((p) => p.name === '财帛宫'),
    career: chart.palaces.find((p) => p.name === '官禄宫'),
    love: chart.palaces.find((p) => p.name === '夫妻宫'),
    health: chart.palaces.find((p) => p.name === '疾厄宫'),
  };

  const focusText = (() => {
    if (!focus) return '궁이나 별을 클릭하면 해당 항목 중심으로 해석이 바뀝니다.';
    if (focus.type === 'star') return `${starLabel(focus.star.name)}은 ${palaceLabel(focus.palace.name)}에 있습니다. 이 별의 성질이 해당 궁의 사건을 통해 드러납니다.`;
    if (focus.type === 'palace') return `${palaceLabel(focus.palace.name)} 선택됨. 주성: ${majorStars(focus.palace)}. 대궁과 삼방사정을 함께 봐야 합니다.`;
    return `${focus.label} 선택됨. 사화는 해당 별의 에너지가 어떤 방식으로 작동하는지 보여주는 운의 표지입니다.`;
  })();

  return (
    <aside style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <section style={sectionStyle}>
        <div className="label-section" style={{ marginBottom: 8 }}>진행 상태</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {['입력 완료', '명반 생성', '격국 감지', '해석 준비'].map((step) => (
            <div key={step} style={{ border: '1px solid var(--ac-bdr)', borderRadius: 8, padding: '8px 6px', color: 'var(--ac)', fontSize: 11, textAlign: 'center', background: 'var(--ac-bg)' }}>
              {step}
            </div>
          ))}
        </div>
      </section>

      <section style={sectionStyle}>
        <div className="label-section" style={{ marginBottom: 8 }}>명반 요약</div>
        <h2 style={{ margin: 0, color: 'var(--tx-0)', fontSize: 20 }}>
          {ming.stars.length ? ming.stars.map(starLabel).join(' · ') : '공궁'} 명궁
        </h2>
        <p style={{ color: 'var(--tx-2)', fontSize: 13, lineHeight: 1.8 }}>
          {koreanizeZiweiText(chart.wuxingJuName)} · {ganZhiLabel(chart.lunarInfo.yearStem, chart.lunarInfo.yearBranch)}년생 · 명궁 {branchLabel(chart.mingGongBranch)} · 신궁 {branchLabel(chart.shenGongBranch)}
        </p>
        {ming.keywords.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ming.keywords.map((keyword) => (
              <span key={keyword} className="sihua-badge" style={{ color: 'var(--ac)', border: '1px solid var(--ac-bdr)', background: 'var(--ac-bg)' }}>
                {keyword}
              </span>
            ))}
          </div>
        )}
      </section>

      <section style={sectionStyle}>
        <div className="label-section" style={{ marginBottom: 8 }}>운세 메뉴</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 12 }}>
          <div>재물: {majorStars(palaces.wealth)}</div>
          <div>직업: {majorStars(palaces.career)}</div>
          <div>관계: {majorStars(palaces.love)}</div>
          <div>건강: {majorStars(palaces.health)}</div>
        </div>
      </section>

      <section style={sectionStyle}>
        <div className="label-section" style={{ marginBottom: 8 }}>현재 흐름</div>
        <p style={{ color: 'var(--tx-2)', fontSize: 13, lineHeight: 1.8, margin: 0 }}>
          보기 모드: {view === 'mingpan' ? '본명' : view === 'daxian' ? '대한' : `${liunianYear}년 ${liuyueMonth}월 유년`}
          <br />
          {current ? `현재 대한은 ${current.startAge}-${current.endAge}세, ${palaceLabel(current.palaceName)}입니다.` : '현재 대한 정보가 없습니다.'}
        </p>
      </section>

      <section style={sectionStyle}>
        <div className="label-section" style={{ marginBottom: 8 }}>격국 결과</div>
        {patterns.length ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {patterns.slice(0, 5).map((pattern) => (
              <div key={pattern.name} style={{ borderLeft: '3px solid var(--ac)', paddingLeft: 10 }}>
                <strong style={{ color: 'var(--tx-0)', fontSize: 13 }}>{koreanizeZiweiText(pattern.name)}</strong>
                <p style={{ color: 'var(--tx-2)', fontSize: 12, lineHeight: 1.7, margin: '4px 0 0' }}>{koreanizeZiweiText(pattern.description)}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: 'var(--tx-3)', fontSize: 12 }}>강하게 감지된 격국은 없습니다.</p>
        )}
      </section>

      <section style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center', marginBottom: 8 }}>
          <div className="label-section">선택 해석</div>
          {focus && <button className="tab-item" type="button" onClick={onClearFocus}>초기화</button>}
        </div>
        <p style={{ color: 'var(--tx-2)', fontSize: 13, lineHeight: 1.8, margin: 0 }}>{focusText}</p>
      </section>
    </aside>
  );
}
