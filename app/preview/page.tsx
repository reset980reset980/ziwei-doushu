'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ScrollIntro from '@/components/ScrollIntro';

export default function PreviewPage() {
  const router = useRouter();
  const [replayKey, setReplayKey] = useState(0);
  const [done, setDone] = useState(false);

  return (
    <>
      <ScrollIntro key={replayKey} onComplete={() => setDone(true)} />

      {done && (
        <main style={{
          minHeight: '100vh',
          background: '#0d0a08',
          color: '#e8dcc4',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '48px 24px',
          fontFamily: '"STSong", "Songti SC", serif',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.4em', color: '#c89647', marginBottom: '16px' }}>
            SCROLL · INTRO · PREVIEW
          </div>
          <h1 style={{
            fontSize: 'clamp(28px, 3.5vw, 40px)',
            letterSpacing: '0.18em',
            color: '#e8dcc4',
            marginBottom: '16px',
            fontWeight: 600,
          }}>
            자미두수 스크롤 인트로 미리보기
          </h1>
          <p style={{
            fontSize: '14px', color: '#a89878',
            maxWidth: '500px', lineHeight: 1.9,
            letterSpacing: '0.1em',
            marginBottom: '40px',
            fontFamily: '"STKaiti", "Kaiti SC", serif',
          }}>
            방금 본 스크롤 효과는 첫 화면 진입 시 부드럽게 펼쳐지는 인트로입니다.<br />
            확인 후 실제 홈 화면에 연결할 수 있습니다.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '24px' }}>
            <button
              onClick={() => { setDone(false); setReplayKey(k => k + 1); }}
              style={{
                background: '#a8302a',
                color: '#f5ecd7',
                padding: '14px 28px',
                fontSize: '14px',
                fontFamily: '"STSong", serif',
                letterSpacing: '0.3em',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
              }}
            >
              다시 보기
            </button>
            <button
              onClick={() => router.push('/')}
              style={{
                background: 'transparent',
                color: '#e8dcc4',
                padding: '14px 28px',
                fontSize: '14px',
                fontFamily: '"STSong", serif',
                letterSpacing: '0.3em',
                border: '1px solid rgba(232,220,196,0.25)',
                cursor: 'pointer',
              }}
            >
              홈으로 이동
            </button>
          </div>

          <div style={{
            marginTop: '40px', fontSize: '12px', color: '#6e6048',
            letterSpacing: '0.15em',
            display: 'flex', gap: '20px',
          }}>
            <Link href="/" style={{ color: 'inherit', textDecoration: 'none' }}>홈 ↗</Link>
            <span>·</span>
            <Link href="/chart" style={{ color: 'inherit', textDecoration: 'none' }}>명반</Link>
            <span>·</span>
            <Link href="/heming" style={{ color: 'inherit', textDecoration: 'none' }}>합반</Link>
          </div>

          <div style={{
            marginTop: '64px',
            padding: '24px 32px',
            border: '1px solid rgba(232,220,196,0.12)',
            maxWidth: '500px',
            fontSize: '12px',
            color: '#a89878',
            lineHeight: 1.9,
            letterSpacing: '0.1em',
            fontFamily: '"STKaiti", serif',
            textAlign: 'left',
          }}>
            <div style={{ color: '#c89647', marginBottom: '12px', letterSpacing: '0.2em', fontSize: '11px' }}>애니메이션 타임라인</div>
            <div>· 0.0 ~ 1.7초 &nbsp;&nbsp;스크롤이 중앙에서 양쪽으로 펼쳐짐</div>
            <div>· 1.9 ~ 2.7초 &nbsp;&nbsp;제목과 부제가 떠오름</div>
            <div>· 2.7 ~ 3.5초 &nbsp;&nbsp;화면 유지</div>
            <div>· 3.5 ~ 4.2초 &nbsp;&nbsp;전체가 사라지고 홈으로 이동</div>
            <div style={{ marginTop: '12px', color: '#6e6048', fontSize: '11px' }}>
              사용자는 언제든 건너뛰고 홈으로 이동할 수 있습니다.
            </div>
          </div>
        </main>
      )}
    </>
  );
}
