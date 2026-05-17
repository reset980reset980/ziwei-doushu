export const metadata = { title: '이용약관 · JamiDusu', description: 'JamiDusu 이용약관' };

export default function TermsPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>이용약관</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>마지막 업데이트: 2026년 5월</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. 서비스 개요</h2>
        <p>JamiDusu는 입력한 생년월일시와 성별, 출생지 정보를 바탕으로 자미두수 명반을 생성하고 참고용 해석을 제공합니다.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. 이용 목적</h2>
        <p>본 서비스는 자기 이해와 전통 명리 학습을 위한 참고 도구입니다. 의료, 투자, 법률, 심리 상담이나 중대한 의사결정의 근거로 사용해서는 안 됩니다.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. 이용자 책임</h2>
        <ul style={{ paddingLeft: 24 }}>
          <li>정확한 출생 정보 입력은 이용자의 책임입니다.</li>
          <li>양력/음력, 윤달, 출생지, 출생 시간 선택에 따라 결과가 달라질 수 있습니다.</li>
          <li>서비스 결과를 과도하게 의존하거나 타인에게 강요해서는 안 됩니다.</li>
        </ul>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. 지식재산권</h2>
        <p style={{ background: 'rgba(168,50,40,0.06)', border: '1px solid rgba(168,50,40,0.2)', padding: 16, borderRadius: 8 }}>
          화면 구성, 한국어 변환 로직, 배포 구성, 서비스용 정리 문구는 본 프로젝트의 산출물입니다. 무단 대량 복제, 자동 수집, 재판매, 서비스 사칭을 금지합니다.
        </p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. 면책</h2>
        <p>명리 해석은 전통 지식과 알고리즘에 기반한 참고 자료이며 정확성을 보장하지 않습니다. 이용 결과로 발생하는 선택과 그 결과에 대한 책임은 이용자에게 있습니다.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. 서비스 변경</h2>
        <p>운영자는 기능 개선, 오류 수정, 보안 조치 등을 위해 일부 기능을 변경하거나 일시 중단할 수 있습니다.</p>

        <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>7. 문의</h2>
        <p>서비스 관련 문의는 운영자가 공지한 연락 수단을 통해 접수할 수 있습니다.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/privacy" style={{ color: 'var(--ac)' }}>개인정보 처리방침</a> · <a href="/" style={{ color: 'var(--ac)' }}>홈으로</a>
        </p>
      </main>
    </>
  );
}
