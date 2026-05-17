'use client';

import type { ZiweiChart } from '@/lib/ziwei/types';
import type { TimeView } from '@/components/TimeNav';

export type { TimeView };

interface TopBarProps {
  chart: ZiweiChart;
  view: TimeView;
  liunianYear: number;
  liuyueMonth: number;
  onViewChange: (view: TimeView) => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onHome?: () => void;
  onShare?: () => void;
  onExport?: () => void;
  copied?: boolean;
}

export default function TopBar({
  chart,
  view,
  liunianYear,
  liuyueMonth,
  onViewChange,
  onYearChange,
  onMonthChange,
  onHome,
  onShare,
  onExport,
  copied,
}: TopBarProps) {
  const tabs: { key: TimeView; label: string }[] = [
    { key: 'mingpan', label: '본명' },
    { key: 'daxian', label: '대한' },
    { key: 'liunian', label: '유년' },
  ];

  return (
    <header className="chart-topbar no-print">
      <button
        onClick={onHome}
        style={{ background: 'none', border: 0, color: 'var(--tx-3)', cursor: 'pointer', fontSize: 13 }}
      >
        자미두수 대시보드
      </button>
      <div className="chart-topbar-back-sep" />

      <div className="chart-topbar-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`tab-item ${view === tab.key ? 'active' : ''}`}
            onClick={() => onViewChange(tab.key)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === 'liunian' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button className="tab-item" type="button" onClick={() => onYearChange(liunianYear - 1)}>‹</button>
          <span style={{ color: 'var(--tx-2)', fontSize: 12, minWidth: 42, textAlign: 'center' }}>{liunianYear}</span>
          <button className="tab-item" type="button" onClick={() => onYearChange(liunianYear + 1)}>›</button>
        </div>
      )}

      <select
        value={liuyueMonth}
        onChange={(event) => onMonthChange(Number(event.target.value))}
        style={{ background: 'var(--bg-card)', color: 'var(--tx-2)', border: '1px solid var(--bdr)', borderRadius: 8, padding: '6px 8px', fontSize: 12 }}
        aria-label="월 선택"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
          <option key={month} value={month}>{month}월</option>
        ))}
      </select>

      <span style={{ color: 'var(--tx-3)', fontSize: 12 }}>
        {chart.birthInfo.name ? `${chart.birthInfo.name} · ` : ''}{chart.currentAge}세
      </span>

      <button className="tab-item chart-topbar-export" type="button" onClick={onExport}>인쇄</button>
      {onShare && (
        <button className="tab-item chart-topbar-export" type="button" onClick={onShare}>
          {copied ? '복사됨' : '공유'}
        </button>
      )}
    </header>
  );
}
