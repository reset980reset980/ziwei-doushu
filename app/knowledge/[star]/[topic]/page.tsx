/**
 * /knowledge/[star]/[topic] — SEO 落地页
 *
 * 14 主星 × 13 topic = 182 个独立 URL
 * 每页含完整的 STAR_DB 4 段论断（一句话定调/核心论断/命盘依据/经典出处）
 *
 * SEO 要点：
 *  - title 含主关键词（如"紫微入命宫·倪海夏体系详解"）
 *  - description 用 dingdiao（一句话定调）
 *  - JSON-LD Article 结构化数据
 *  - 内链：同主星其他 12 宫 + 同宫其他 13 主星
 *  - generateStaticParams 静态生成，零运行时开销
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { TopicKey } from '@/lib/ziwei/db-analysis';
import {
  ALL_STARS,
  ALL_TOPICS,
  getKnowledge,
  getAllKnowledgeRoutes,
  STAR_BRIEF_SEO,
  STAR_TO_SLUG,
  SLUG_TO_STAR,
} from '@/lib/seo/knowledge';
import { koreanizeZiweiText, palaceLabel, starLabel } from '@/lib/ziwei/labels';

// 允许动态参数：如果某个 star/topic 组合不在 generateStaticParams 列表中
// 也允许运行时按需渲染，避免中文 URL 编码问题导致 404
export const dynamicParams = false;

export async function generateStaticParams() {
  const routes = getAllKnowledgeRoutes();
  // URL 用拼音 slug 替代中文，避开 Vercel/CDN 中文路由边界问题
  return routes.map(r => ({ star: r.slug, topic: r.topic }));
}

export async function generateMetadata({ params }: { params: Promise<{ star: string; topic: string }> }) {
  const { star: slug, topic } = await params;
  const star = SLUG_TO_STAR[slug];
  if (!star) return {};
  const data = getKnowledge(star, topic as TopicKey);
  if (!data.exists) return {};

  const title = `${starLabel(star)}이 ${palaceLabel(data.palaceName)}에 있을 때 · ${data.topicLabel} · 니하이샤 체계 해석`;
  const description = data.parsed.dingdiao
    ? koreanizeZiweiText(data.parsed.dingdiao)
    : `${starLabel(star)}이 ${palaceLabel(data.palaceName)}에 있을 때의 자미두수 해석입니다. 니하이샤 천기 체계와 자미두수 고전을 바탕으로 정리했습니다.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://wdyziweidoushu666.com/knowledge/${slug}/${topic}`,
    },
    alternates: {
      canonical: `https://wdyziweidoushu666.com/knowledge/${slug}/${topic}`,
    },
    keywords: [
      '자미두수', '니하이샤', starLabel(star), palaceLabel(data.palaceName), data.topicLabel,
      `${starLabel(star)} ${palaceLabel(data.palaceName)}`,
      `자미두수 ${starLabel(star)}`, '자미두수전집',
    ],
  };
}

export default async function KnowledgePage({ params }: { params: Promise<{ star: string; topic: string }> }) {
  const { star: slug, topic } = await params;
  const star = SLUG_TO_STAR[slug];
  if (!star) notFound();
  const data = getKnowledge(star, topic as TopicKey);
  if (!data.exists) notFound();

  // 同主星其他 topic
  const otherTopicsForStar = ALL_TOPICS.filter(t => t !== topic && getKnowledge(star, t).exists);
  // 同 topic 其他主星
  const otherStarsForTopic = ALL_STARS.filter(s => s !== star && getKnowledge(s, topic as TopicKey).exists);

  // JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${starLabel(star)}이 ${palaceLabel(data.palaceName)}에 있을 때 · ${data.topicLabel}`,
    description: koreanizeZiweiText(data.parsed.dingdiao),
    author: { '@type': 'Organization', name: '자미두수 연구 · 니하이샤 체계' },
    publisher: {
      '@type': 'Organization',
      name: '자미두수 연구',
      url: 'https://wdyziweidoushu666.com',
    },
    datePublished: '2026-04-28',
    dateModified: '2026-04-28',
    mainEntityOfPage: `https://wdyziweidoushu666.com/knowledge/${slug}/${topic}`,
    articleSection: '자미두수 · 니하이샤 체계',
    keywords: [`자미두수`, starLabel(star), palaceLabel(data.palaceName), data.topicLabel].join(', '),
  };

  return (
    <div style={{ background: 'var(--bg-page)', minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 顶栏 */}
      <div className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(184,146,42,0.15)', background: 'var(--bg-page)' }}>
        <Link href="/" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.3em', textDecoration: 'none' }}>
          ← 홈
        </Link>
        <div style={{ fontSize: '12px', color: 'var(--tx-3)', letterSpacing: '0.2em' }}>
          니하이샤 체계 · 지식베이스
        </div>
        <Link href="/chart" style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.2em', textDecoration: 'none' }}>
          명반 →
        </Link>
      </div>

      <article className="max-w-3xl mx-auto px-6 py-12">
        {/* 面包屑 */}
        <nav style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.1em', marginBottom: '16px' }}>
          <Link href="/" style={{ color: 'var(--tx-3)', textDecoration: 'none' }}>홈</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <Link href="/knowledge" style={{ color: 'var(--tx-3)', textDecoration: 'none' }}>지식베이스</Link>
          <span style={{ margin: '0 8px' }}>/</span>
          <span>{starLabel(star)}</span>
          <span style={{ margin: '0 8px' }}>·</span>
          <span style={{ color: 'var(--ac)' }}>{palaceLabel(data.palaceName)}</span>
        </nav>

        {/* 标题区 */}
        <header style={{ marginBottom: '36px' }}>
          <div style={{ fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.25em', marginBottom: '8px' }}>
            {data.topicLabel} · 니하이샤 체계 해석
          </div>
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 700, color: 'var(--tx-0)', letterSpacing: '0.1em', lineHeight: 1.2 }}>
            {starLabel(star)}이 {palaceLabel(data.palaceName)}에 있을 때
          </h1>
          {STAR_BRIEF_SEO[star] && (
            <p style={{ fontSize: '13px', color: 'var(--tx-2)', marginTop: '14px', lineHeight: 1.8 }}>
              {koreanizeZiweiText(STAR_BRIEF_SEO[star])}
            </p>
          )}
        </header>

        {/* 内容 4 段 */}
        {data.parsed.dingdiao && (
          <Section title="한 줄 요약" gradient>
            <p style={{ fontSize: '17px', color: 'var(--tx-0)', lineHeight: 1.9, fontWeight: 500, letterSpacing: '0.04em' }}>
              {koreanizeZiweiText(data.parsed.dingdiao)}
            </p>
          </Section>
        )}

        {data.parsed.lundian && (
          <Section title="핵심 판단">
            <div style={{ fontSize: '15px', color: 'var(--tx-0)', lineHeight: 2, letterSpacing: '0.02em', whiteSpace: 'pre-wrap' }}>
              {koreanizeZiweiText(data.parsed.lundian)}
            </div>
          </Section>
        )}

        {data.parsed.yiju && (
          <Section title="명반 근거">
            <div style={{ fontSize: '14px', color: 'var(--tx-0)', lineHeight: 2, letterSpacing: '0.02em', whiteSpace: 'pre-wrap' }}>
              {koreanizeZiweiText(data.parsed.yiju)}
            </div>
          </Section>
        )}

        {data.parsed.chuchu && (
          <Section title="고전 출처" minimal>
            <div style={{ fontSize: '13px', color: 'var(--tx-2)', lineHeight: 2, letterSpacing: '0.02em', whiteSpace: 'pre-wrap' }}>
              {koreanizeZiweiText(data.parsed.chuchu)}
            </div>
          </Section>
        )}

        {/* CTA */}
        <div style={{
          margin: '40px 0 30px',
          padding: '24px',
          background: 'linear-gradient(135deg, rgba(212,169,72,0.15) 0%, rgba(184,146,42,0.06) 100%)',
          borderRadius: '14px',
          border: '1px solid rgba(184,146,42,0.3)',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '14px', color: 'var(--tx-0)', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '6px' }}>
            내 명반의 {data.topicLabel}도 보고 싶다면
          </div>
          <div style={{ fontSize: '12px', color: 'var(--tx-2)', marginBottom: '16px' }}>
            출생 정보를 넣고 명반을 만들면 한국어 해석과 AI 질의가 이어집니다.
          </div>
          <Link href="/chart" style={{
            display: 'inline-block',
            padding: '12px 28px',
            background: 'linear-gradient(135deg, #d4a948 0%, #b8922a 100%)',
            color: 'white',
            borderRadius: '999px',
            fontSize: '14px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textDecoration: 'none',
            boxShadow: '0 4px 12px rgba(184,146,42,0.3)',
          }}>
            바로 명반 만들기 →
          </Link>
        </div>

        {/* 内链：同主星其他 topic */}
        <Section title={`${starLabel(star)}성의 다른 주제 해석`} minimal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherTopicsForStar.map(t => {
              const d = getKnowledge(star, t);
              return (
                <Link
                  key={t}
                  href={`/knowledge/${slug}/${t}`}
                  style={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    background: 'var(--bg-card)',
                    border: '1px solid rgba(184,146,42,0.25)',
                    borderRadius: '999px',
                    color: 'var(--tx-2)',
                    textDecoration: 'none',
                  }}
                >
                  {starLabel(star)} · {palaceLabel(d.palaceName)}
                </Link>
              );
            })}
          </div>
        </Section>

        {/* 内链：同 topic 其他主星 */}
        <Section title={`${palaceLabel(data.palaceName)}에 있는 다른 주성 해석`} minimal>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {otherStarsForTopic.slice(0, 13).map(s => (
              <Link
                key={s}
                href={`/knowledge/${STAR_TO_SLUG[s]}/${topic}`}
                style={{
                  fontSize: '12px',
                  padding: '6px 12px',
                  background: 'var(--bg-card)',
                  border: '1px solid rgba(184,146,42,0.25)',
                  borderRadius: '999px',
                  color: 'var(--tx-2)',
                  textDecoration: 'none',
                }}
              >
                {starLabel(s)} · {palaceLabel(data.palaceName)}
              </Link>
            ))}
          </div>
        </Section>

        {/* 古籍库链接 */}
        <div style={{
          marginTop: '40px',
          padding: '16px 20px',
          background: 'rgba(184,146,42,0.04)',
          border: '1px dashed rgba(184,146,42,0.25)',
          borderRadius: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '11px', color: 'var(--ac-dim)', letterSpacing: '0.15em', marginBottom: '6px' }}>
            원문도 확인하고 싶다면
          </div>
          <Link href="/library" style={{ fontSize: '13px', color: 'var(--ac)', fontWeight: 500, letterSpacing: '0.1em', textDecoration: 'none' }}>
            고전 원문 자료실 보기 - 자미두수전집 / 전서 / 골수부 →
          </Link>
        </div>
      </article>

      {/* 页脚 */}
      <footer style={{ borderTop: '1px solid rgba(184,146,42,0.15)', padding: '20px 24px', textAlign: 'center', fontSize: '11px', color: 'var(--tx-3)', letterSpacing: '0.1em' }}>
        <div style={{ marginBottom: '6px' }}>자미두수 연구 · 니하이샤 체계 기반 · 학습 참고용</div>
        <div style={{ opacity: 0.85 }}>본 서비스는 의료, 투자, 법률 또는 중대한 의사결정 조언이 아닙니다.</div>
      </footer>
    </div>
  );
}

function Section({ title, children, gradient, minimal }: { title: string; children: React.ReactNode; gradient?: boolean; minimal?: boolean }) {
  return (
    <section style={{ marginBottom: minimal ? '24px' : '32px' }}>
      <h2 style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '13px',
        color: 'var(--ac)',
        fontWeight: 600,
        letterSpacing: '0.2em',
        marginBottom: '12px',
      }}>
        <span style={{ width: '4px', height: '14px', background: 'var(--ac)', borderRadius: '2px' }} />
        {title}
      </h2>
      <div style={{
        background: gradient
          ? 'linear-gradient(135deg, rgba(212,169,72,0.12) 0%, rgba(184,146,42,0.04) 100%)'
          : 'white',
        border: '1px solid rgba(184,146,42,0.15)',
        borderRadius: '10px',
        padding: minimal ? '14px 18px' : '20px 22px',
      }}>
        {children}
      </div>
    </section>
  );
}
