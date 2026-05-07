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

콘텐츠 영역에 단일 최대 너비를 적용해 페이지 간 폭이 흔들리지 않게 한다.

```css
--container-page: 1920px;
```

규칙:
- **메인 콘텐츠 영역**(모든 페이지의 최상위 섹션, `<main>` 안)은 `max-width: var(--container-page)` + `margin-inline: auto`로 가운데 정렬.
- **Header와 Footer는 컨테이너를 적용하지 않고 뷰포트 풀폭** 사용. chrome 역할로 콘텐츠 영역을 framing하는 시각 레이어를 형성한다 (큰 모니터에서 로고는 화면 좌측 끝에, 네비는 우측 끝에).
- 좌우 패딩(컨테이너 내부 + Header/Footer 내부 동일): 모바일 `--space-4` (16px), 태블릿/데스크톱 `--space-8` (32px).
- 카드 그리드는 이 컨테이너 안에서 반응형 컬럼 수가 조정된다 (§7 참조).
- Design 상세 등의 풀블리드 이미지도 컨테이너 너비 안에서 폭 100%로 흐른다 (≤1920px). 4K 이상 모니터에서 무한히 펼쳐지지 않는 안전장치.
- **너비 결정 근거**: FHD(1920px)에서 Header/Footer(풀폭)와 메인 콘텐츠 영역의 시각적 폭이 정확히 일치하도록 설정. 그보다 큰 디스플레이(27" 이상)에서는 메인만 1920px에서 멈춰 자연스러운 framing이 형성된다.

본문성 페이지(About/Home 등)는 추후 가독성 보정으로 본문 블록에 별도 max-width(예: `max-w-prose`)를 줄 수 있다.

Tailwind 클래스: `max-w-page mx-auto` (Tailwind v4 `--container-*` 토큰 → 유틸리티 자동 생성).

### 헤더 → 콘텐츠 호흡

헤더(64px)와 페이지 콘텐츠가 너무 붙으면 답답해 보인다. 두 층의 합으로 약 72/112px(모바일/데스크톱)의 시각 간격을 만든다.

- `<main>`에 `pt-2 md:pt-4` (8/16px) — 모든 페이지에 적용되는 헤더 직하 미세 들여쓰기.
- 공개 페이지 최상위 섹션은 `py-16 md:py-24` (64/96px) — 페이지별 콘텐츠 자체의 상하 호흡.
- 두 층이 누적되어 헤더 → 첫 콘텐츠 = `pt-2 + py-16` (72px) / `pt-4 + py-24` (112px).

관리자 페이지는 도구 성격이라 더 좁은 `py-16` (64px)을 유지 — 헤더 직하 가독성보단 운영 효율을 우선.

### 관리자 컨테이너

```css
--container-form: 640px;  /* sm 분기점과 일치 */
```

관리자 페이지 전체(`/admin` 및 모든 하위)는 공개 페이지(`max-w-page` 1920px)와 다른 좁고 가운데 정렬된 컨테이너를 쓴다. 운영자는 카탈로그 스캔이 아니라 등록·편집·확인을 한다 — FHD 화면 가득 펼쳐진 인풋·리스트는 도구로서 비효율이다.

규칙:
- 모든 admin 섹션: `mx-auto max-w-form px-4 md:px-8` (640px, 화면 가운데).
- `/admin/login` 만 별도 `max-w-sm` (384px) — 인증 폼은 더 좁힘.
- 너비 = sm 분기점(640px). 페이지 폭 ladder(640 → 768 → 1024 → 1280 → 1920)에서 자연스러운 한 칸을 차지한다.
- 컨테이너 안의 폼·리스트·상세 row는 별도 max-width를 두지 않는다 — 컨테이너가 곧 폼 폭이다.
- DesignForm의 이미지 보드 3-column 그리드는 컨테이너 폭 안에서 ~205px/썸네일이 되지만 admin 한정이라 OK.
- 저장 버튼: Primary 스타일 유지 + `self-end`(컨테이너 우측 끝 정렬). 시선 흐름 자연스러움 + 버튼 너비가 텍스트 길이로만 결정되어 위치는 항상 우측 고정.

Tailwind 클래스: `max-w-form` (Tailwind v4 `--container-form` 토큰 → 유틸리티 자동 생성).

### 좌우 분할 레이아웃 (sticky)

"한쪽은 메타·요약, 한쪽은 길게 흐르는 본문" 구조의 페이지에서 사용한다.

- **비율**: 좌측 1 : 우측 2 (`lg:grid lg:grid-cols-3` + 우측 `lg:col-span-2`).
- **좌측은 sticky**: `lg:sticky lg:self-start` + 페이지별 보정된 `top` 값. `self-start`가 없으면 grid가 컬럼 높이를 늘려 sticky가 깨진다.
- **`top` 값 규칙 (중요)**: 좌측 컬럼의 자연 시작 위치(헤더 64px + 컨테이너 상단 패딩)와 정확히 일치시킨다. 그래야 첫 픽셀부터 sticky가 잠겨서 컬럼이 이동 없이 같은 자리에 머무르고, 헤더가 자연 흐름으로 위로 사라지는 동안에도 시각적 점프가 발생하지 않는다.
  - 페이지별 권장값:
    - `/design/[slug]` (article `py-16 md:py-24`): `lg:top-40` (160px = 64 + 96)
    - `/contact` (section `py-16 md:py-24`): `lg:top-40` (160px = 64 + 96)
  - 새 페이지 추가 시 동일한 공식으로 산정해 적용한다.
- **컬럼 사이 간격**: `lg:gap-12` (48px).
- **반응형**: `lg` (1024px) 미만에서는 단일 컬럼으로 stack. 우측 블록에 `mt-12 lg:mt-0`로 세로 간격 보정.
- **적용 페이지**: `/design/[slug]`, `/contact`. 좌측에 제목·메타·짧은 안내·연락 채널, 우측에 이미지 갤러리 또는 폼.

### 도형 (Border Radius)

요소가 페이지 흐름에서 떨어져 있을수록 radius가 커진다는 단일 원칙으로 통일한다. 세 개 tier만 사용하고 ad hoc 혼용은 금지.

| Tier | 값 | 적용 |
|---|---|---|
| **Stroke** | `0` (radius 없음) | 검색·필터 인풋. 하단 1px 보더만, 시각 무게 가장 가벼움. |
| **Filled (sm)** | `--radius-sm` (4px) | 페이지 흐름 안의 인터랙티브 블록 — 폼 인풋, 1차/2차 버튼. |
| **Floating (pill)** | `--radius-pill` (9999px) | 페이지에서 떨어져 떠 있는 요소 — 필터 칩, 뱃지, 모바일 하단 플로팅 네비게이션. |

원칙:
- **Stroke vs Filled vs Floating** 셋 중 어느 카테고리에 해당하는지 먼저 판단한 뒤 그 tier의 radius를 적용한다.
- `--radius-md` (8px) 토큰은 정의는 유지하되 spec에서 사용처 없음 (legacy).
- disclosure 펼침 panel 같은 보조 영역은 inline 확장으로 처리해 별도 floating box를 만들지 않는다 — 그래야 tier 추가 없이 시스템 유지 가능.

---

## 5. 컴포넌트

### 5.1 버튼

**Primary (1순위 CTA)** — 외주 문의 보내기, admin 저장 등 폼의 결정 액션
```
배경: --color-ink (#000)
글자: --color-paper (#fff)
패딩: 16px 32px
폰트: 16px / weight 500
보더: 없음
border-radius: 4px
호버: opacity 0.85
```
- 폼 안에서 사용 시 정렬: `self-end`(우측 끝). 시선이 라벨/인풋 → 우측 하단 행동 버튼 순으로 흐른다.
- 적용: `/admin/{products,design}/{new,edit}` 저장, `/admin/inquiries/[id]` 메일로 답장, `/contact` 의뢰 보내기.

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

용도에 따라 두 종류의 시각 무게로 구분한다. ad hoc 혼용 금지.

**Form input (액티브 — 사용자가 자기 데이터를 입력하는 폼)**
```
배경: --color-cloud (#efefef)
글자: --color-ink
보더: 없음
패딩: 12px 16px
폰트: 16px (모바일 자동 zoom 방지를 위해 최소 16px 유지)
border-radius: 4px
포커스: 1px --color-ink ring
플레이스홀더: --color-fog (#a1a1a1)
```
- 적용: `/contact` 폼, 로그인/관리자 폼 등 폼 필드 전반.
- 의도: 채워진 배경이 "여기에 입력하세요" affordance를 분명히 전달한다.

**Search/Filter input (패시브 — 사용자가 둘러보기 위한 입력)**
```
배경: 투명
글자: --color-ink
보더: 하단만 1px --color-mist
패딩: 12px 0 (좌우 패딩 없음 — 풀폭 확장 전제)
폰트: 16px
border-radius: 0
포커스: 하단 보더 --color-ink로
플레이스홀더: --color-fog (#a1a1a1)
```
- 적용: `/design`, `/admin/design`, `/admin/inquiries` 검색바 등.
- 의도: 풀폭 검색바의 시각 무게를 가볍게 유지해 페이지의 주된 콘텐츠(카드/리스트)에 시선이 먼저 가게 한다.

**Date input (월 단위, 커스텀 `MonthPicker`)**
- DB가 `'YYYY-MM'` 텍스트만 보관하므로 일(day) 단위 datepicker는 무의미. 자체 컴포넌트 `components/MonthPicker.tsx`를 사용한다.
- 트리거는 Form input 토큰(`bg-cloud rounded-sm px-4 py-3`) 그대로. 우측에 chevron 표시.
- 클릭 시 트리거 바로 아래에 패널 열림 — 좌우 화살표로 연도 이동, 12개 월 3-column 그리드. 선택된 월은 `bg-ink text-paper`.
- 외부 클릭·Esc로 닫힘. submit 시 hidden input(`type=hidden`)으로 `YYYY-MM` 전송 — DB·서버 액션과 100% 호환.
- 네이티브 `<input type="month">`를 사용하지 않는 이유: OS별 picker가 보정되지 않아 사이트 톤과 어긋남, 스크롤 휠 인터랙션이 불편함.
- 적용: `/admin/design/{new,edit}` 작업 시기, `/admin/products/{new,edit}` 출시일.

### 5.3 필터 (Design 인덱스)

#### 5.3.1 트리거 + 패널 disclosure

검색 input과 두 개의 필터 트리거(Field / Format)는 **하나의 stroke 라인을 공유**한다. 데스크톱에서 칩이 항상 펼쳐져 있으면 시각적으로 너저분해지므로, 모든 뷰포트에서 동일한 disclosure 패턴을 사용한다.

```
배치 (한 행, border-b mist 공유):
  md+:    [검색 input (flex-1)]   [Field ▾]   [Format ▾]
  md 미만: [검색 input (flex-1)]                  [필터 ▾]
  ↑ 좌측: stroke search input — §5.2 Search/Filter input 토큰

ChipTrigger:
  py-3, text-small, gap-1.5
  선택 0개: text-stone (호버 시 text-ink)
  선택 1개+: text-ink + 우측에 (n) 카운트 뱃지 (text-caption)
  우측 chevron: 12px, 펼쳤을 때 rotate-180
  배경/보더 없음 — 라인은 부모 컨테이너의 border-b가 담당

포커스 라인 컬러:
  부모 컨테이너에 has-[input:focus]:border-ink — input 포커스 시에만 라인이 ink로
  트리거 버튼 클릭은 border 색을 바꾸지 않는다 (검색 affordance 유지)

반응형:
  md+: input + Field 트리거 + Format 트리거가 한 행. 트리거 두 개 분리 노출 — 가로 공간이 넉넉해 한눈 파악 우선.
  md 미만: input과 단일 "필터" 트리거가 한 행 공유. 카운트는 Field+Format 합. 한 손 시야 안에 머무는 단일 진입점으로 시각 무게 최소화.
```

패널은 트리거 바로 아래에 inline으로 펼쳐진다 (push, not floating). 데스크톱은 트리거가 둘이라 어느 쪽을 눌렀느냐에 따라 해당 그룹의 chips만 표시. 모바일은 트리거 하나라 펼치면 Field / Format 두 그룹이 caption 라벨(text-caption text-stone)과 함께 stack — 한 번에 다 보고 다 고를 수 있어 모달 없이도 충분한 작업 공간 확보. 다른 트리거를 누르면 그쪽이 열리고 이전 패널은 닫힘. 외부 클릭·Esc로도 닫힘.

**왜 모바일에서 모달이 아닌가**: 풀스크린 #000 overlay는 시각 무게가 무거워 사이트의 ghost-like UI 철학과 충돌. floating tier도 추가됨(§4 회피 원칙). inline 단일 트리거 + 통합 패널이 더 적은 chrome으로 같은 정리 효과를 낸다.

#### 5.3.2 칩 자체 (panel 내부)

선택 안 됨:
```
배경: 투명
글자: --color-stone
보더: 1px --color-mist
border-radius: 9999px (Floating tier — pill)
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

"전체" 버튼은 항상 패널 첫 자리에 — 선택이 0일 때 active 상태. 한 번 누르면 선택 초기화.

### 5.3-2 Toggle (관리자 전용)

binary 상태(공개/비공개 등)를 표시하는 작은 트랙·thumb 토글. iOS 스타일에 가깝지만 mokuworks 색만 사용.

```
트랙: 40 × 24px, --radius-pill
  off: bg-mist
  on:  bg-ink
thumb: 20 × 20px, bg-paper, 작은 그림자
  off: 좌측 (left 2px)
  on:  우측 (translate-x-16px)
라벨: 우측에 16px text-ink
```

- 시스템 기본 체크박스는 운영자가 매번 마주하는 admin 폼에서 가장 거슬리는 element라 교체. 토글이 가장 작고 조용한 binary 컨트롤.
- 내부적으로 `<input type="checkbox" class="peer sr-only">` 위에 `peer-checked:`로 시각 상태 전환 — 폼 제출은 일반 체크박스와 동일하게 `formData.get(name) === "on"`.
- 컴포넌트: `components/Toggle.tsx`.
- 적용: `/admin/{design,products}/{new,edit}` 공개 여부.

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
  컨테이너(`max-w-page`) + 페이지 좌우 패딩 안에서 폭 100% — 인덱스 카드와 동일한 좌우 정렬선
  이미지 사이 간격: 24px (`--gap-card-grid`) — 인덱스 카드 그리드 gap과 동일해 페이지 간 박자 일치
  이미지 wrapper: `bg-cloud overflow-hidden rounded-sm` — 인덱스 카드 썸네일과 동일한 §4 Filled tier radius
  이미지 자체는 width 100%, height auto

페이지 하단:
  "Design 작업 더 보기" Ghost 버튼 → /design 으로
```

### 5.6 헤더 (네비게이션)

```
높이: 64px
배경: --color-paper (스크롤 시에도 동일)
좌측: mokuworks 로고 이미지 (`public/logo.svg`)
  - 높이: 모바일 16px (`h-4`) / 데스크톱 20px (`h-5`), width 비율 자동
  - 호버: opacity 0.6
우측 (md 이상만): Design / Products / About / Contact (16px, weight 400, --color-ink)
  - 호버: opacity 0.6
  - 현재 페이지: opacity 0.6 (활성 표시는 약하게)
  - **모바일(< md)에서는 메뉴를 노출하지 않음** — §5.8 모바일 하단 플로팅 네비게이션으로 대체.
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

### 5.8 모바일 하단 플로팅 네비게이션

모바일(< md)에서만 노출되는 capsule(pill) nav로, 헤더에서 빠진 메뉴 4개를 담는다. 데스크톱에서는 표시되지 않음(`md:hidden`).

```
표시 조건: viewport < 768px (md 미만)
위치: position: fixed; bottom: 24px; left: 16px; right: 16px (가로 풀폭, 좌우 16px gutter)
배경: --color-paper at 70% alpha (`bg-paper/70`)
backdrop-filter: blur ~12px (`backdrop-blur-md`)
보더: 1px --color-mist at 60% alpha (`border-mist/60`)
border-radius: 9999px (--radius-pill, capsule 형태)
패딩: 12px 16px
z-index: 40
콘텐츠: Design / Products / About / Contact
  - 가로 균등 배치 (justify-around) + gap-6
  - 16px / weight 400 / --color-ink
  - 호버: opacity 0.6
  - 현재 페이지: opacity 0.6 (헤더 메뉴와 동일한 약한 활성 표시)
  - 항목 수가 늘어 폭을 초과하면 가로 슬라이드 (`overflow-x-auto`, 스크롤바 숨김)
```

스크롤 인터랙션:
- 페이지 상단(scroll < 100px)에서는 nav가 숨겨져 있다 (`opacity-0 translate-y-2`).
- 100px 이상 스크롤 시 fade-in + 8px 슬라이드업으로 등장 (`transition-all duration-300 ease-out`).
- 다시 100px 미만으로 돌아오면 fade-out.
- 의도: 첫 화면을 깨끗하게, 콘텐츠 탐색 중일 때만 메뉴 노출. 데스크톱 헤더가 스크롤로 사라지는 것과 대칭되는 모바일 패턴.

레이아웃 보정:
- `<body>`에 `pb-24 md:pb-0` (모바일 96px 하단 패딩) 적용해 푸터·콘텐츠가 pill에 가려지지 않게 한다.
- backdrop-blur로 뒤 콘텐츠를 부드럽게 흐리게 — 시각 무게 최소화 + 떠 있는 느낌 강조.

원칙:
- 사이트 전역 검색이 없으므로 minimalissimo와 달리 검색 입력은 두지 않는다. 메뉴 4개만 단순 가로 배치.
- 햄버거 + 풀스크린 오버레이 패턴은 사용하지 않는다 — 메뉴 항목 수가 적어 노출 시 항상 보이는 게 더 직관적.
- pill 형태 + blur 처리는 §4 도형 시스템의 "Floating" tier에 해당. 필터 칩과 동일 radius philosophy로 일관됨.

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
1024px+:   3 컬럼
```

### Design 인덱스 — 큼직 카드 변주

작품 카드 그리드(`/design`)에 한해 pentagram 스타일의 변주를 적용한다. 큼직(2×2) 카드를 일정 빈도로 끼워 페이지에 호흡과 강약을 만든다.

- **빈도**: 5개당 1개. 첫 사이클은 큼직이 왼쪽, 다음 사이클은 오른쪽 — 10 카드 한 사이클로 좌·우 번갈음.
- **빈 자리**: 큼직 옆 위쪽엔 일반 카드 1개, 아래쪽은 의도적으로 비워둔다. 빈 자리는 카드 텍스트 라인 충돌을 피하면서 시각적 호흡으로 작동.
- **dense 사용 안 함.** `grid-auto-flow`는 기본값. 카드 위치는 `--lg-col` / `--lg-row` CSS custom property로 명시 배치.
- **2 컬럼**: 큼직은 한 행 통째(`col-span-2 row-span-2`). `nth-child(5n+1)`. 옆 빈 칸 없음.
- **1 컬럼**: 큼직 OFF, 균일.
- **이미지 비율**: 큼직·일반 모두 4:3 유지. 큼직은 폭이 2배라 면적 4배.
- 변주의 결정 기준은 "필터 후 화면 인덱스" — 검색·필터마다 자연스럽게 재배치된다.

3 컬럼 패턴 (10 카드 한 사이클):
```
[ BIG  ][ 1 ]      [ 6 ][ BIG  ]
[      ][   ]← 빈  [   ][      ]← 빈
[ 2 ][ 3 ][ 4 ]    [ 7 ][ 8 ][ 9 ]
```

- 구현: `app/globals.css`의 `.design-grid` 클래스 + `app/design/DesignCatalog.tsx`의 `lgPlacement(i)` 함수.

### 모바일 우선 고려사항

- 본문 폰트 최소 16px 유지 (iOS 자동 zoom 방지)
- 헤더는 모바일에서 **로고만 표시** (16px). 4개 메뉴는 §5.8의 하단 플로팅 pill로 분리 — 헤더 우측 공간 정리.
- §5.3 필터(field / format)는 모든 뷰포트에서 disclosure 패턴(trigger + inline panel) 사용. md+에서는 검색 input과 트리거 두 개(Field/Format)가 한 행을, 모바일에서는 검색 input과 단일 "필터" 트리거가 한 행을 공유한다 (트리거는 우측 정렬).
- 좌우 패딩: 모바일 16px / 데스크톱 32px
- 작품 상세 풀블리드 이미지는 모바일에서도 진짜 풀블리드 (좌우 패딩 0)
- `<body>`에 `pb-24 md:pb-0`로 하단 플로팅 pill이 콘텐츠/푸터를 가리지 않게 한다.

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
