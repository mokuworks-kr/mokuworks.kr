# mokuworks 디자인 가이드

mokuworks 사이트의 시각 디자인 시스템. minimalissimo의 미니멀리즘 철학을 기반으로 mokuworks의 정체성(1인 메이커, 한글 우선, 외주 수주 동선)에 맞춰 튜닝.

본 문서는 **어떻게 보일지**를 다룬다. **무엇을 만들지**는 `SPEC.md`에서 정의한다. 두 문서가 충돌할 경우 SPEC.md가 우선이며, 본 문서는 시각적 표현 방식만 결정한다.

---

## 1. 디자인 철학

> 사이트는 후퇴하고 작품이 빛난다.

UI 요소는 ghost-like — 존재를 알리지만 시선을 빼앗지 않는다. 이미지와 텍스트가 시각적 주인공이고, 컴포넌트는 그 받침이다. 외주 클라이언트가 사이트에 와서 기억해야 할 것은 "사이트가 예뻤다"가 아니라 "이 사람 작업이 좋다"여야 한다.

### 핵심 원칙

1. **콘텐츠 우선** — 작품 이미지와 작품 제목이 페이지의 주역. UI 컴포넌트는 보조.
2. **무채색 캔버스** — 색은 작품 자체에서 온다. 사이트는 흑백/회색조로 캔버스 역할.
3. **여백이 말한다** — 작품과 작품, 섹션과 섹션 사이 충분한 호흡. 빽빽함은 신뢰를 떨어뜨린다.
4. **절제된 위계** — 한 페이지에 헤딩 사이즈 2-3개면 충분. 굵기 변화도 제한적으로.
5. **사람 냄새의 흔적** — 차가워지지 않도록 About, Contact 톤에서 약간의 따뜻함 허용.

---

## 2. 색상

```css
:root {
  /* Core */
  --color-ink:       #000000;   /* 본문, 헤딩, 주요 UI, 1순위 CTA */
  --color-canvas:    #f5f5f5;   /* 섹션 배경, 약한 구획 */
  --color-paper:     #ffffff;   /* 페이지 배경 기본 */

  /* Subdued */
  --color-stone:     #999999;   /* 보조 텍스트 (캡션, 메타) */
  --color-mist:      #e0e0e0;   /* 보더, 구분선 */
  --color-cloud:     #efefef;   /* 인풋·고스트 버튼 배경 */
  --color-fog:       #a1a1a1;   /* 비활성 상태, 매우 약한 텍스트 */
}
```

### 사용 규칙

- **본문 텍스트**: `--color-ink` 단색. 회색 본문 금지 (가독성 손해).
- **보조 텍스트**(클라이언트명, 작업 시기, 캡션): `--color-stone`. 이 자리에만 회색 허용.
- **1순위 CTA**(외주 문의 버튼, "의뢰 보내기" 등): 반드시 `--color-ink` 풀 컨트라스트 — 검은 배경 + 흰 글자, 또는 명확한 검은 보더 + 검은 글자.
- **2순위 액션**(필터 칩, "더 보기"): `--color-mist` 보더 + `--color-ink` 글자. 호버 시 보더만 살짝 진해짐.
- **`--color-stone`을 CTA 버튼 배경/글자로 쓰지 말 것** — minimalissimo 가이드 명시 사항. 절제된 무채색 시스템에서 회색 CTA는 "약한 의도"로 읽혀 전환율을 떨어뜨림.

### 다크 모드

v1에서는 다크 모드를 구현하지 않는다. 작품 이미지(인쇄물, 브랜딩)는 라이트 배경에서 가장 정확하게 표현되며, 다크 모드는 작품 색감을 왜곡할 위험이 있다.

---

## 3. 타이포그래피

### 폰트

**Asta Sans** 단일 사용. 한글과 라틴을 한 패밀리에서 처리.

```css
:root {
  --font-sans: 'Asta Sans', -apple-system, BlinkMacSystemFont,
               'Segoe UI', Roboto, sans-serif;
}
```

**왜 Asta Sans인가**
- 한글 + 라틴 통합 패밀리라 폰트 두 개 섞을 때의 비율 어긋남 없음
- 숫자(3, 6, 9 등) 형태가 깔끔하고 유니크함 — 작업 시기(`2026-02`)나 가격대 같은 숫자 표시가 자주 등장하는 사이트라 이게 누적 효과
- Pretendard 대비 사용 빈도 낮아 시각적 피로도 덜함
- 가변 폰트 (300~800), 라이선스 무료

### 웨이트

```css
--weight-regular:   400;   /* 본문, 라벨, 대부분의 자리 */
--weight-medium:    500;   /* 작품 제목, 헤딩 */
--weight-semibold:  600;   /* 페이지 타이틀, 임팩트 자리 */
```

`Light(300)`, `Bold(700)`, `ExtraBold(800)`은 **사용하지 않는다**. 절제된 시스템 유지를 위해 3단계로 한정.

### 사이즈 스케일

minimalissimo의 16px 본문 + 24px 단일 헤딩은 매거진 카드형엔 적당하지만, mokuworks에는 작품 상세 페이지 등 더 큰 임팩트가 필요한 자리가 있어 스케일 확장.

```css
:root {
  --text-caption:    12px;   /* 메타 라벨, 매우 작은 보조 */
  --text-small:      14px;   /* 캡션, 보조 텍스트 */
  --text-body:       16px;   /* 본문 기본 */
  --text-title:      24px;   /* 섹션 헤딩, 카드 강조 */
  --text-heading:    32px;   /* 페이지 타이틀, 작품 상세 제목 */
  --text-display:    48px;   /* 히어로, 특별한 자리 (드물게) */
}
```

`--text-display`(48px)는 v0/v1에서 거의 사용 안 함. About/Home v1에서 히어로 만들 때만 후보.

### 행간 (Line Height)

한글은 라틴보다 글자 시각 무게가 무거워서 더 넓은 행간이 필요하다. minimalissimo의 1.4 → mokuworks는 **1.6**으로 조정.

```css
:root {
  --leading-tight:   1.3;    /* 큰 헤딩 (24px+) */
  --leading-snug:    1.5;    /* 중간 사이즈 */
  --leading-normal:  1.6;    /* 본문 기본 — 한글 가독성 우선 */
  --leading-relaxed: 1.75;   /* 긴 글, description 본문 */
}
```

규칙:
- 16px 본문 → `--leading-normal` (1.6)
- 작품 description처럼 길게 흐르는 글 → `--leading-relaxed` (1.75)
- 24px 이상 헤딩 → `--leading-tight` 또는 `--leading-snug`

### 자간 (Letter Spacing)

기본 0. 한글에서 음수 자간은 글자가 붙어 보이므로 피한다. 12px 이하 캡션에서만 `+0.02em` 정도로 살짝 여유 줘서 가독성 보강.

---

## 4. 여백 시스템

4px 단위 베이스. 큰 단위로 갈수록 8의 배수로 안정.

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-24: 96px;
  --space-32: 128px;
}
```

### 핵심 간격

```css
--gap-section:     96px;    /* 섹션과 섹션 사이 */
--gap-element:     16px;    /* 작은 요소 사이 (제목과 부제목, 카드 내부) */
--gap-card-grid:   24px;    /* 카드 그리드의 카드 사이 */
--padding-card:    16px;    /* 카드 내부 패딩 */
--padding-page:    32px;    /* 페이지 좌우 패딩 (모바일 16px) */
```

### 페이지 컨테이너

최대 너비 강제하지 않음. 화면 폭에 자연스럽게 따라감 (작품 카드 그리드의 컬럼 수가 반응형으로 조정).

좌우 패딩만 적용:
- 모바일(~768px): `--space-4` (16px)
- 태블릿/데스크톱: `--space-8` (32px) 또는 더 넓게

---

## 5. 컴포넌트

### 5.1 버튼

**Primary (1순위 CTA)** — 외주 문의 보내기, 등 핵심 액션
```
배경: --color-ink (#000)
글자: --color-paper (#fff)
패딩: 16px 32px
폰트: 16px / weight 500
보더: 없음
border-radius: 4px
호버: opacity 0.85
```

**Secondary (Subtle Filled)** — 부차적 액션
```
배경: --color-cloud (#efefef)
글자: --color-ink
보더: --color-mist (#e0e0e0)
패딩: 16px 24px
폰트: 16px / weight 400
border-radius: 4px
호버: 보더 색을 --color-stone으로
```

**Ghost** — 텍스트 링크형 액션 ("더 보기", "취소" 등)
```
배경: 없음
보더: 없음
글자: --color-ink, weight 400
패딩: 0
호버: opacity 0.6
```

### 5.2 입력 필드

```
배경: --color-cloud (#efefef)
글자: --color-ink
보더: 없음 (또는 하단만 1px --color-mist)
패딩: 12px 16px
폰트: 16px (모바일에서 자동 zoom 방지를 위해 최소 16px 유지)
border-radius: 4px
포커스: 보더(또는 하단 보더) --color-ink로
플레이스홀더: --color-fog (#a1a1a1)
```

### 5.3 필터 칩 (Design 인덱스)

선택 안 됨:
```
배경: 투명
글자: --color-stone
보더: 1px --color-mist
border-radius: 9999px (완전 둥근)
패딩: 6px 16px
폰트: 14px / weight 400
호버: 보더 --color-stone으로
```

선택됨:
```
배경: --color-ink
글자: --color-paper
보더: --color-ink
나머지 동일
```

### 5.4 작품 카드 (Design 인덱스)

```
이미지 영역:
  비율: 4:3
  배경: --color-cloud (이미지 로딩 전 placeholder)
  overflow: hidden
  호버: 이미지만 scale(1.05), transition 700ms ease-out

텍스트 영역:
  카드 하단, 이미지와의 간격 12px
  제목: --color-ink, 16px, weight 500, 한 줄 ellipsis
  클라이언트: --color-stone, 14px, weight 400, 제목과 4px 간격

전체:
  보더, 그림자, 배경 모두 없음
  카드 영역 클릭 가능 (Link로 감싸기)
  호버 시 카드 자체엔 변화 없음 (이미지 줌만)
```

### 5.5 작품 상세 (풀블리드)

```
페이지 상단:
  좌우 패딩 적용 영역
  제목: 32px, weight 600, --color-ink
  메타 정보 (클라이언트 · 작업 시기 · 태그): 14px, --color-stone, 제목과 16px 간격
  description (있을 때): 16px, --color-ink, leading 1.75, 메타와 32px 간격, 본문 max-width 660px

이미지 영역 (메타 아래):
  화면 폭 풀블리드 (좌우 패딩 무시)
  이미지 사이 간격: 0 또는 1px --color-mist (시각 디자인 시점에 결정)
  이미지 자체는 width 100%, height auto

페이지 하단:
  "Design 작업 더 보기" Ghost 버튼 → /design 으로
```

### 5.6 헤더 (네비게이션)

```
높이: 64px
배경: --color-paper (스크롤 시에도 동일)
좌측: mokuworks 로고 이미지 (`public/logo.svg`)
  - 높이: 모바일 28px, 데스크톱 32px (width 비율 자동)
  - 호버: opacity 0.6
우측: Design / Products / About / Contact (16px, weight 400, --color-ink)
  - 호버: opacity 0.6
  - 현재 페이지: opacity 0.6 (활성 표시는 약하게)
보더 하단: 없음 (또는 1px --color-mist, 시각 디자인 시점 결정)
```

### 5.7 푸터

```
배경: --color-paper 또는 --color-canvas
패딩: 64px 32px
구성:
  - 짧은 mokuworks 소개 한 줄 (--color-stone, 14px)
  - 연락처 (이메일, 카카오톡 링크)
  - 인스타그램·네이버 블로그 링크 (자동화 단계 이후)
  - 저작권 표기 (--color-fog, 12px)
모든 링크: --color-ink, weight 400, 호버 opacity 0.6
```

---

## 6. 인터랙션

### 트랜지션

```css
:root {
  --transition-fast:  150ms ease-out;   /* 호버, 작은 상태 변화 */
  --transition-base:  300ms ease-out;   /* 페이지 요소 등장 */
  --transition-slow:  700ms ease-out;   /* 이미지 줌 등 큰 변화 */
}
```

### 호버 효과 원칙

- 색 변화는 최소 — opacity 변화로 대부분 해결 (`opacity: 0.6` 또는 `0.85`)
- 카드 호버는 카드 자체가 아니라 그 안의 이미지만 변화 (scale 1.05)
- 그림자, 회전, 큰 변형 사용 안 함

### 페이지 전환

페이지 진입 시 `fade-in 300ms` 정도. 슬라이드/회전 애니메이션 없음.

---

## 7. 반응형

### 브레이크포인트

```css
--bp-sm:  640px;
--bp-md:  768px;
--bp-lg:  1024px;
--bp-xl:  1280px;
```

### 카드 그리드 컬럼

```
~640px:    1 컬럼
640~1024px: 2 컬럼
1024~1280px: 3 컬럼
1280px+:    4 컬럼
```

### 모바일 우선 고려사항

- 본문 폰트 최소 16px 유지 (iOS 자동 zoom 방지)
- 헤더 네비게이션은 모바일에서 햄버거가 아니라 **그대로 가로 나열** (메뉴 4개라 충분히 들어감). 텍스트 크기만 살짝 줄임.
- 좌우 패딩: 모바일 16px / 데스크톱 32px
- 작품 상세 풀블리드 이미지는 모바일에서도 진짜 풀블리드 (좌우 패딩 0)

---

## 8. 톤 디테일 (페이지별)

### Design / Products / 관리자
순수 미니멀 톤. 위 시스템 그대로.

### Contact
약간 따뜻함 허용:
- 페이지 안내 문구에 "보통 1-2일 안에 회신드려요" 같은 사람 어조
- 폼 라벨도 딱딱한 명사형보다 자연스러운 표현 ("어떤 작업을 원하시나요?" 식)
- 색상/컴포넌트는 시스템 그대로

### About (v1 시점)
가장 따뜻한 톤. 시스템은 유지하되:
- 본문 행간 `--leading-relaxed` 사용
- 큰 따옴표 인용구나 짧은 문장 강조 같은 약간의 변주 허용

---

## 9. 금지 사항

- 그라디언트 (배경, 텍스트 모두)
- 그림자 (`box-shadow`, `text-shadow`)
- 둥근 모서리 과용 (`border-radius`는 최대 8px, 칩만 9999px)
- 색상 강조 (`#FF0000`, `#0000FF` 등 채도 높은 색)
- 이모지 (텍스트 영역)
- 애니메이션 GIF, 자동재생 영상
- 폰트 두 개 이상 혼용
- 800 이상의 굵은 웨이트
- Bold 강조 (`<strong>`은 weight 500-600 정도로만 표현)

---

## 10. 시각 자산

### 로고/워드마크

mokuworks 로고는 `public/logo.svg` 단일 파일 사용. Header를 비롯해 사이트 어디든 로고가 필요한 자리에 동일 파일을 동일 색(검정) 그대로 배치. SVG 한 가지 색만 쓰므로 라이트/다크 변형은 v1에선 만들지 않음.

### Favicon / OG 이미지

- Favicon: 검은 배경 + 흰 'm' 또는 'mw' 단순 문자
- OG 이미지: 작품 페이지는 작품 대표이미지, 일반 페이지는 검은 배경 + Asta Sans 워드마크의 단순 이미지

### 일러스트/아이콘

장식용 일러스트 사용 안 함. 아이콘은 lucide-react 또는 동급의 stroke 기반 미니멀 아이콘 라이브러리에서 가져오되, 본문 사이즈와 같거나 작게(16px) 사용.

---

## 11. 구현 노트

### 폰트 로딩

```html
<link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
```

```css
@font-face {
  font-family: 'Asta Sans';
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url('https://cdn.jsdelivr.net/gh/fonts-archive/AstaSans/AstaSans-Regular.woff2') format('woff2'),
       url('https://cdn.jsdelivr.net/gh/fonts-archive/AstaSans/AstaSans-Regular.woff') format('woff');
}
@font-face {
  font-family: 'Asta Sans';
  font-weight: 500;
  font-style: normal;
  font-display: swap;
  src: url('https://cdn.jsdelivr.net/gh/fonts-archive/AstaSans/AstaSans-Medium.woff2') format('woff2');
}
@font-face {
  font-family: 'Asta Sans';
  font-weight: 600;
  font-style: normal;
  font-display: swap;
  src: url('https://cdn.jsdelivr.net/gh/fonts-archive/AstaSans/AstaSans-SemiBold.woff2') format('woff2');
}
```

또는 Google Fonts 호스팅 사용:
```html
<link href="https://fonts.googleapis.com/css2?family=Asta+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

400/500/600 세 웨이트만 로딩. 나머지 웨이트는 본 디자인 시스템에서 사용 안 함.

### CSS 변수 적용 위치

`globals.css`의 `:root`에 모든 토큰 선언. 컴포넌트는 변수만 참조.

### Tailwind 사용 시

위 토큰들을 `tailwind.config.js`의 `theme.extend.colors`, `fontSize`, `spacing` 등으로 매핑. 토큰 이름은 위 CSS 변수와 동일하게 유지(`ink`, `canvas`, `stone` 등).
