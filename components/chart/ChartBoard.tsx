'use client';

import RootChartBoard from '@/components/ChartBoard';
import type { Palace, Star, ZiweiChart } from '@/lib/ziwei/types';
import type { TimeView } from '@/components/TimeNav';

interface ChartBoardProps {
  chart: ZiweiChart;
  view: TimeView;
  liunianYear: number;
  onStarClick?: (star: Star, palace: Palace) => void;
  onPalaceClick?: (palace: Palace) => void;
  onSiHuaBadgeClick?: (starName: string, siHua: string, view: TimeView) => void;
  onTimeViewChange?: (view: TimeView) => void;
}

export default function ChartBoard({
  chart,
  view,
  liunianYear,
  onTimeViewChange,
  onStarClick,
  onPalaceClick,
  onSiHuaBadgeClick,
}: ChartBoardProps) {
  return (
    <RootChartBoard
      chart={chart}
      onStarSelect={onStarClick}
      onPalaceSelect={onPalaceClick}
      onSiHuaClick={onSiHuaBadgeClick}
    />
  );
}
