# JamiDusu 한국어 자미두수 대시보드

한국 사용자를 기준으로 만든 자미두수 명반 생성 및 해석 대시보드입니다. 원본 오픈소스의 배반 알고리즘과 격국 탐지 로직을 기반으로, 입력 화면과 결과 화면, 지식베이스, 고전 자료실, 주요 해석 문구를 한국어로 정리했습니다.

서비스 URL: <https://jamidusu.xsw.kr>

## 주요 기능

- 양력/음력 생년월일 입력
- 음력 윤달 입력 지원
- 한국 시군구 기반 출생지 선택
- 한국 표준시 기준 진태양시 보정
- 자미두수 12궁 명반 생성
- 명궁, 신궁, 대한, 유년 흐름 표시
- 격국 탐지 및 한국어 결과 표시
- `巨日同宫`, `财帛`, `迁移`, `太阴化忌` 등 주요 한자 용어 한국어 변환
- 지식베이스와 고전 원문 자료실의 한국어 UI
- 직접 입력, 공유 URL, 최근 명반 복원 경로의 동일한 명반 변환 규칙
- 합반 API와 기본 해석 API 제공
- Caddy + PM2 운영 배포 구성

## 한국어 표시 기준

명반 내부 계산은 `iztro`가 쓰는 중국어 별명과 궁명을 유지합니다. 화면 표시 직전에는 한국어 라벨로 변환합니다.

예시:

| 원문 | 표시 |
| --- | --- |
| 巨日同宫 | 거일동궁 |
| 财帛宫 | 재백궁 |
| 迁移宫 | 천이궁 |
| 太阴化忌 | 태음 화기 |
| 巨门太阳同寅宫 | 거문과 태양이 인궁에 함께 있음 |

## 빠른 시작

```bash
npm install
npm run dev
```

개발 서버는 기본적으로 <http://localhost:3000>에서 실행됩니다.

## 빌드

```bash
npm run build
npm run start
```

## API

### `POST /api/generate`

명반을 생성합니다.

```json
{
  "year": 1990,
  "month": 1,
  "day": 1,
  "hour": 6,
  "gender": "male",
  "calendarType": "lunar",
  "isLeapMonth": false,
  "name": "테스트"
}
```

`calendarType`은 `solar` 또는 `lunar`입니다. 음력 윤달이면 `isLeapMonth`를 `true`로 보냅니다.

### `POST /api/interpret`

생성된 명반 JSON을 받아 한국어 SSE 해석을 반환합니다.

### `POST /api/heming`

두 명반을 비교해 한국어 합반 요약을 반환합니다.

## 배포

현재 운영 배포는 다음 구성을 사용합니다.

- Next.js production server: `127.0.0.1:3220`
- PM2 process: `jamidusu`
- Caddy domain: `jamidusu.xsw.kr`

운영 반영 절차:

```bash
npm run build
pm2 restart jamidusu
pm2 save
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Caddy 설정은 `jamidusu.xsw.kr`을 `127.0.0.1:3220`으로 reverse proxy합니다.

## 기술 스택

- Next.js App Router
- TypeScript
- React
- Tailwind CSS
- Framer Motion
- iztro
- lunar-javascript
- PM2
- Caddy

## 프로젝트 구조

| 경로 | 설명 |
| --- | --- |
| `app/chart` | 한국어 명반 대시보드 화면 |
| `app/api/generate` | 명반 생성 API |
| `app/api/interpret` | 한국어 해석 SSE API |
| `app/api/heming` | 합반 요약 SSE API |
| `components/BirthForm.tsx` | 양력/음력 입력 폼 |
| `components/PatternsCard.tsx` | 격국 결과 카드 |
| `components/insight/InsightPanel.tsx` | 우측 한국어 해석 패널 |
| `lib/ziwei/algorithm.ts` | iztro 기반 명반 생성 |
| `lib/ziwei/labels.ts` | 한자 용어 한국어 변환 |
| `lib/ziwei/share.ts` | URL 공유 파라미터와 진태양시 계산 |
| `lib/ziwei/cities.ts` | 한국 지역/경도 데이터 |

## 참고

이 프로젝트는 전통 명리 콘텐츠를 다루지만, 결과는 자기 이해와 참고용입니다. 의료, 투자, 법률, 심리 상담이나 중대한 의사결정의 근거로 사용하지 마세요.

## 라이선스

MIT License
