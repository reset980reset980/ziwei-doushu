export const metadata = { title: '개인정보 처리방침 · JamiDusu', description: 'JamiDusu 개인정보 처리방침' };

export default function PrivacyPage() {
  return (
    <>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-0)', borderBottom: '1px solid var(--bdr)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--tx-3)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span>홈으로</span>
        </a>
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em' }}>JamiDusu</span>
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>개인정보 처리방침</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>마지막 업데이트: 2026년 5월</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. 수집하는 정보</h2>
        <p>명반 생성과 해석 서비스를 제공하기 위해 다음 정보를 사용할 수 있습니다.</p>
        <ul style={{ paddingLeft: 24 }}>
          <li><strong>명반 필수 정보</strong>: 이름(선택), 생년월일, 출생 시간, 성별, 출생지 경도</li>
          <li><strong>이용 정보</strong>: 화면 클릭, 최근 명반 기록, 입력 이력</li>
          <li><strong>피드백 정보</strong>: 해석 결과에 대한 평가와 의견</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. 정보 이용 목적</h2>
        <ul style={{ paddingLeft: 24 }}>
          <li>입력한 출생 정보를 바탕으로 자미두수 명반을 생성합니다.</li>
          <li>최근 명반과 화면 설정을 브라우저에 저장해 재입력을 줄입니다.</li>
          <li>오류 분석과 서비스 품질 개선에 필요한 범위에서만 사용합니다.</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. 제3자 제공</h2>
        <p>법령상 요구가 있거나 서비스 운영에 필요한 기술 제공자를 제외하고, 개인 정보를 임의로 판매하거나 공유하지 않습니다.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. 보안</h2>
        <p>HTTPS 전송, 접근 권한 관리 등 일반적인 보호 조치를 적용합니다. 다만 인터넷 전송과 브라우저 저장소는 절대적인 보안을 보장하지 않습니다.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. 이용자의 권리</h2>
        <ul style={{ paddingLeft: 24 }}>
          <li>브라우저 저장 데이터는 사용자가 직접 삭제할 수 있습니다.</li>
          <li>서비스 이용을 중단하면 추가 입력 정보는 저장되지 않습니다.</li>
          <li>개인정보 관련 요청은 운영자에게 문의할 수 있습니다.</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. 쿠키와 로컬 저장소</h2>
        <p>테마 설정, 최근 명반 기록, 입력 편의를 위해 브라우저 저장소를 사용할 수 있습니다. 브라우저 설정에서 삭제할 수 있습니다.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. 유의 사항</h2>
        <p>명리 해석은 자기 이해를 위한 참고 자료입니다. 의료, 투자, 법률, 심리 상담 또는 중대한 의사결정의 근거로 사용하지 마세요.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/terms" style={{ color: 'var(--ac)' }}>이용약관</a> · <a href="/" style={{ color: 'var(--ac)' }}>홈으로</a>
        </p>
      </main>
    </>
  );
}
