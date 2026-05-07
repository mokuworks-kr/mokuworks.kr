# mokuworks 사이트 명세

이 문서는 mokuworks 사이트가 **무엇을 하는 사이트인지, 어떤 데이터를 다루는지, 각 페이지가 어떻게 동작하는지**를 정의한다. 시각 디자인은 별도 문서(`DESIGN.md`)에서 다룬다. 본 문서는 디자인 결정에 관여하지 않는다.

---

## 1. 정체성과 전략

### 포지셔닝
mokuworks는 **1인 메이커 통합 브랜드**다. "moku가 만드는 모든 것"이 우산이 된다. 그래픽 디자인 외주 작업물과 자체 웹앱 제품이 동등한 시민으로 공존한다.

### 방문자 기대 행동의 우선순위
1. **외주 문의** (1순위) — 디자인 일거리 수주가 사이트의 주요 수익 동력
2. **웹앱 사용자 확보** (2순위) — 자체 제품의 사용자 모으기
3. **팬 형성** (3순위) — 장기적 관계 구축

### 핵심 내러티브
> 웹앱은 디자인 신뢰의 증거다.

웹앱 사이드 프로젝트는 단순 자랑이 아니라 "이 사람은 도구를 직접 만들 만큼 디자인을 깊이 이해한다"의 증거로 작동한다. 디자인 외주 우위를 메인으로 가져가면서 웹앱이 그 우위를 보강하는 구조.

---

## 2. 정보 구조

### 라우팅

| 경로 | 페이지 | 단계 |
|---|---|---|
| `/` | Home | v0 |
| `/design` | Design 인덱스 | v1 |
| `/design/{slug}` | Design 상세 | v1 |
| `/products` | Products 인덱스 | v1 |
| `/product/{slug}` | Product 마이크로사이트 | v1 |
| `/about` | About | v0 |
| `/contact` | Contact | v1 |
| `/admin` | 관리자 대시보드 (인증 보호) | v1 |
| `/admin/design` | 디자인 CRUD | v1 |
| `/admin/products` | 제품 CRUD | v1 |
| `/admin/inquiries` | 문의 인박스 | v1 |
| `/admin/tags` | 태그 관리 | v1 |

**v0** = 본격 구축 전 placeholder. "준비 중" 메시지 + 다른 페이지로 동선 안내만.
**v1** = 본격 구축 대상.

### 글로벌 네비게이션
헤더에 표시되는 메뉴: `Design / Products / About / Contact`.
관리자 페이지는 네비게이션에 노출하지 않음.

---

## 3. 데이터 모델 (Supabase)

### `design` 테이블

디자인 외주 작업물. 카탈로그형으로 다수(수십~수백 개) 누적.

| 칸 | 타입 | 비고 |
|---|---|---|
| `id` | uuid (PK) | 자동 생성 |
| `title` | text | 작업명 |
| `slug` | text (unique) | URL용. 사람이 직접 입력 |
| `client` | text | 클라이언트명 |
| `description` | text | 자유 길이. 짧게도 길게도 가능 |
| `date` | text | `'YYYY-MM'` 형식 |
| `tags` | text[] | 태그 ID 배열 (다중 선택) |
| `image_url` | text | 대표이미지 URL (이 칸에 들어가 있다는 사실 자체 = 대표) |
| `gallery` | text[] | 나머지 이미지 URL 배열. 순서 = 상세 노출 순서 |
| `published` | boolean | 공개 토글. 기본 false |
| `created_at` | timestamptz | 자동 |

**대표이미지의 의미.** 별도의 "대표 번호" 칸은 두지 않는다. `image_url`에 들어 있는 URL이 곧 대표다. 관리자에서 별표를 클릭하면 그 URL이 `image_url`로 이동하고, 원래 있던 URL은 `gallery`로 이동한다.

### `products` 테이블

자체 웹앱 제품. 한 자릿수, 길게 봐야 수십 개 규모. 각각 코드로 직접 만든 마이크로사이트가 본체이고, 이 테이블은 메타정보만 보관.

| 칸 | 타입 | 비고 |
|---|---|---|
| `id` | uuid (PK) | 자동 |
| `name` | text | 제품명 |
| `slug` | text (unique) | URL용 |
| `tagline` | text | 한 줄 소개 |
| `image_url` | text | 대표이미지 1장 (목록 카드, OG 이미지) |
| `external_domain` | text? | 외부 도메인 (예: `suma.app`). 옵션 |
| `launch_date` | text? | `'YYYY-MM'` 형식. 옵션 |
| `published` | boolean | 공개 토글 |
| `created_at` | timestamptz | 자동 |

### `tags` 테이블

작업 분류용. 두 축으로 운영: `format`(작업 형태: 브로슈어·리플렛, 포스터, 웹·앱, 현장·전시)과 `field`(산업 분야: 식음료, 뷰티·라이프스타일, 문화·교육, 테크·플랫폼, 웰니스·헬스케어, 공공·비영리, 전문서비스, 제조업).

| 칸 | 타입 | 비고 |
|---|---|---|
| `id` | uuid (PK) | 자동 |
| `name` | text | 표시명 (한글) |
| `category` | text | `'format'` 또는 `'field'` |
| `created_at` | timestamptz | 자동 |

`design.tags`는 이 테이블의 `id`들을 배열로 보관. 한 작업에 여러 태그(여러 format, 여러 field 모두 가능) 다중 선택.

**기본 시드 (마이그레이션으로 자동 적재)**:
- Field: 식음료, 뷰티·라이프스타일, 문화·교육, 테크·플랫폼, 웰니스·헬스케어, 공공·비영리, 전문서비스, 제조업
- Format: 브로슈어·리플렛, 포스터, 웹·앱, 현장·전시

영문 슬러그(자동화 등에서 필요할 때 참고용. DB에 저장하지 않음):
- Field: `food-beverage`, `lifestyle-beauty`, `culture-education`, `tech-platform`, `wellness-healthcare`, `public-nonprofit`, `professional-services`, `manufacturing`
- Format: `brochure-leaflet`, `poster`, `web-app`, `onsite-exhibition`

### `inquiries` 테이블

Contact 페이지 문의 폼이 자동 저장.

| 칸 | 타입 | 비고 |
|---|---|---|
| `id` | uuid (PK) | 자동 |
| `name` | text | 필수 |
| `email` | text | 필수 |
| `company` | text? | 옵션 |
| `formats` | text[] | 선택한 format 태그 ID 배열 + "기타" 선택 시 `'other'` 마커 포함 |
| `work_other` | text? | "기타" 선택 시 자유 입력 (UI 라벨은 "기타 포맷") |
| `budget_range` | text? | 옵션. 드롭다운 값 (예: `'~50만원'`, `'50-100만원'` 등) |
| `timeline` | text? | 옵션. 드롭다운 값 (예: `'~2주'`, `'2-4주'` 등) |
| `message` | text | 필수 |
| `status` | text | `'new'` \| `'replied'` \| `'archived'`. 기본 `'new'` |
| `created_at` | timestamptz | 자동 |

---

## 4. Storage 구조

Supabase Storage에 두 버킷:

```
design-images/    (디자인 작업 이미지)
product-images/   (웹앱 이미지)
```

### 파일명 규칙 (디자인)

```
{client}_{YYMM}_{분량또는작업명}_{넘버링}.{확장자}

예: dnotitia_2602_20p_01.png
   dnotitia_2602_20p_02.png
   ...
```

- `client`: 클라이언트 약칭
- `YYMM`: 작업 시기 (2자리 연도 + 2자리 월)
- `분량/작업명`: 인쇄물은 페이지 수(`20p`), 웹은 작업 식별자
- `넘버링`: `01`부터
- `확장자`: `png` 또는 `jpg`

업로드 시 파일명 sanitize는 공백을 언더바로만 치환(`name.replace(/\s+/g, '_')`). 위 규칙은 이미 sanitize 통과 형식이라 원본 그대로 저장됨.

업로드 옵션은 `upsert: true` (같은 이름 다시 올리면 덮어쓰기. 이미지 수정 시 편의).

### 제품 이미지

제품 수가 적으므로 폴더 분리 강제하지 않음. 파일명에 제품 slug 접두사 정도 붙이면 충분.

---

## 5. 페이지별 명세

### 5.1 Home (`/`)

**v0**: "mokuworks 사이트 구축 중이에요" 메시지 + Design / Products / Contact 페이지로 가는 링크. 끝.

**v1**: 별도 명세 시점에 정의. (홈은 작업물이 어느 정도 쌓이고 정체성이 명확해진 뒤 본격 설계)

### 5.2 About (`/about`)

**v0**: "About 페이지 준비 중이에요" 메시지 + Contact 링크.

**v1**: 추후 정의.

### 5.3 Contact (`/contact`)

외주 문의를 받는 페이지. 1순위 CTA.

**구성** (위에서 아래):
1. 페이지 제목 (예: "프로젝트 의뢰하기")
2. 짧은 안내 1-2줄 (받는 작업 종류, 평균 응답 시간)
3. 문의 폼
4. 직접 연락 채널 (이메일, 카카오톡)

**문의 폼 칸**:
- 이름 (필수)
- 이메일 (필수)
- 회사/소속 (옵션)
- **작업 종류** (체크박스 그룹, 다중 선택 가능)
  - `tags` 테이블의 `category='format'` 항목 + "기타"
  - 옵션 목록은 DB에서 자동으로 가져옴 (코드에 하드코딩 X)
  - "기타" 체크 시 자유 입력 한 줄 등장
- **예산** (드롭다운, 옵션) — 값 예시: `~50만원`, `50-100만원`, `100-300만원`, `300만원+`, `협의`
- **일정** (드롭다운, 옵션) — 값 예시: `~2주`, `2-4주`, `1-2개월`, `2개월+`, `협의`
- 메시지 (자유 입력, 필수)

**제출 시 동작**:
1. `inquiries` 테이블에 row 생성 (`status='new'`)
2. moku의 이메일로 알림 발송 (Resend 또는 Supabase Edge Function)
3. 폼 영역에 성공 메시지 표시

### 5.4 Design 인덱스 (`/design`)

작업 카탈로그. 외주 클라이언트가 가장 시간 많이 보내는 페이지.

**구성**:
- 상단 검색바 — 제목/클라이언트로 검색
- 두 종류 필터 (각각 칩/pill 형태, 다중 선택, "All" 버튼으로 초기화)
  - **Field 필터** — `tags` 중 `category='field'`
  - **Format 필터** — `tags` 중 `category='format'`
- 카드 그리드 — 1/2/3/4 컬럼 반응형, 4:3 비율 이미지

**카드에 표시할 정보**:
- 대표이미지 (`image_url`)
- 제목 (`title`)
- 클라이언트 (`client`)

**정렬**: `date` 역순 자동. 별도 수동 정렬 칸 없음.

**필터링 로직**:
- 검색어가 있으면 제목 / 클라이언트 / 설명에 포함된 작업만
- Field 필터가 선택된 경우, 작업의 태그 중 하나라도 선택된 field에 포함되어야 함
- Format 필터도 동일
- 모든 조건 AND

**`published=false`인 작업은 노출하지 않음.**

### 5.5 Design 상세 (`/design/{slug}`)

**레이아웃**: 풀블리드 세로 스크롤. 대표이미지(`image_url`)부터 `gallery` 순서대로 화면 폭을 꽉 채워 위에서 아래로 흐름.

**텍스트 영역**:
- 페이지 상단 (이미지들 위): 제목, 클라이언트, 작업 시기, 태그
- `description`이 비어있지 않으면 어딘가에 텍스트 블록으로 표시 (상단 또는 하단 — 시각 디자인에서 결정)

**SEO/공유**:
- `<title>`: `{작업 제목} | mokuworks`
- `<meta description>`: `description`의 첫 100자 (없으면 `{title} — {client}`)
- OG 이미지: `image_url`

**관련 작업/이전다음 네비게이션**: v1에선 생략. 작업 인덱스로 돌아가는 링크만.

### 5.6 Products 인덱스 (`/products`)

웹앱 제품 목록. 단순 카드 그리드.

**카드에 표시**:
- 대표이미지 (`image_url`)
- 이름 (`name`)
- 한 줄 소개 (`tagline`)

**정렬**: `launch_date` 역순. 미설정이면 `created_at` 역순.

**필터 없음** — 어차피 한 자릿수.

**`published=false`인 제품은 노출하지 않음.**

### 5.7 Product 마이크로사이트 (`/product/{slug}`)

각 제품마다 코드로 직접 페이지 작성. 통일된 템플릿 강제하지 않음. 제품 성격에 맞게 자유 구성.

**DB가 알려주는 것**:
- 제품 존재 여부 (`slug`로 조회)
- `external_domain`이 설정되어 있다면, 이 페이지에서 그 도메인으로의 canonical link 또는 redirect 처리 가능

**구현 방식**:
- 페이지 파일 자체를 제품별로 작성 (`app/product/[slug]/page.tsx`에서 slug별 분기, 또는 별도 라우트)
- 공통 정보(이름, 태그라인, 대표이미지)는 DB에서 가져와 메타 태그/OG 등에 활용
- 페이지 본문 콘텐츠(섹션 구성, 스크린샷, 기능 설명 등)는 코드 안에 직접 작성

**외부 도메인 연결**:
- `external_domain`이 있으면, 그 도메인이 같은 페이지를 가리키도록 Vercel에서 도메인 추가
- 예: `suma.app` → `mokuworks.kr/product/suma`와 동일 콘텐츠

### 5.8 관리자 대시보드 (`/admin`)

**인증**: Supabase Auth (이메일 + 비밀번호 방식)로 moku 본인 계정 1개만. 신규 가입 페이지 없음 — 계정은 Supabase 대시보드에서 직접 1회 생성. 미인증 시 `/admin/login`으로 리디렉션. 로그인 페이지는 이메일·비밀번호 두 칸 + 로그인 버튼만.

**`/admin` (대시보드 홈)**:
- 최근 등록한 작업 5개
- 미답변 문의 수 (`status='new'`)
- 각 관리 페이지로의 링크

#### 5.8.1 `/admin/design`

작업 목록 + 신규/편집 폼.

**목록**:
- 썸네일 + 제목 + 클라이언트 + 작업 시기 + 공개 여부 토글
- 행별 액션: 편집, 삭제
- 필터: Field/Format 칩 (공개 페이지와 동일한 패턴)
- 검색: 제목/클라이언트

**신규/편집 폼**:
- 칸: 제목, slug, 클라이언트, 설명, 작업 시기, 태그 다중 선택, 공개 여부
- **이미지 업로드 영역**:
  - 드래그앤드롭 또는 클릭으로 다중 파일 업로드
  - 업로드 즉시 미리보기 (`URL.createObjectURL`로 blob 미리보기)
  - 각 이미지에 별표 버튼 — 클릭 시 그 이미지가 대표(`image_url`) 지정
  - 각 이미지에 X 버튼 — 삭제
  - 이미지 카드 드래그로 순서 변경
- **태그 다중 선택 UI**:
  - Field 그룹과 Format 그룹을 시각적으로 분리해서 표시
  - 저장은 같은 `tags` 배열에 합쳐서

**저장 시 동작**:
1. 새로 업로드된 파일들을 Supabase Storage에 업로드 (파일명 sanitize, `upsert: true`)
2. 모든 이미지의 최종 URL 결정
3. 별표 표시된 이미지의 URL을 `image_url`로, 나머지를 `gallery` 배열로 분리
4. `design` 테이블에 insert/update

#### 5.8.2 `/admin/products`

제품 목록 + 신규/편집 폼. design과 유사하되 단순 버전.

**폼 칸**:
- 이름, slug, 한 줄 소개
- 대표이미지 (1장만 업로드)
- 외부 도메인 (옵션)
- 출시일 (옵션)
- 공개 여부

#### 5.8.3 `/admin/inquiries`

문의 인박스.

**목록**:
- 최신순 정렬
- status 필터 탭: 전체 / 새 문의 (`new`) / 답장함 (`replied`) / 보관함 (`archived`)
- 각 행: 이름, 회사, 작업종류, 예산, 일정, 받은 시각, status 뱃지
- 검색: 이름/회사/메시지 본문

**상세**:
- 행 클릭 시 전체 메시지 표시
- "메일로 답장" 버튼 → `mailto:` 링크로 메일 클라이언트 오픈 (자동 회신 시스템 없음)
- status 토글: "답장함으로 표시", "보관함으로 이동"

#### 5.8.4 `/admin/tags`

태그 추가/편집/삭제.

- Field 그룹과 Format 그룹 분리 표시
- 신규 추가 폼 (이름 + 카테고리 선택)
- 편집/삭제 액션
- **삭제 시 안전장치**: 해당 태그를 사용 중인 작업이 있으면 경고. 강제 삭제 시 모든 작업의 `tags` 배열에서도 제거.

---

## 6. 자동화 (사이트 v1 이후)

사이트 v1 안정화 후 다음 자동화를 별도 단계로 구축. **v1 구축 시점에는 데이터 모델이 이 자동화를 지원할 수 있는 형태인지만 보장.**

### 인스타그램 자동 포스팅
- 새 디자인 작업 publish → 인스타 캐러셀 자동 생성·발행
- 이미지: `image_url` + `gallery`
- 캡션: `title`, `client`, `description`(첫 문장), 태그명 → 해시태그

### 네이버 블로그 자동 포스팅
- 새 디자인 작업 publish → 네이버 블로그 글 자동 작성·발행
- 본문: `description` 전체 + 모든 이미지

### 구현 방식
Supabase의 publish 이벤트(또는 cron)를 트리거로 별도 워커가 처리. 본 사이트 코드와 분리.

---

## 7. 운영 원칙

### Single Source of Truth
모든 작업/제품/문의 데이터의 원천은 Supabase. 사이트, 인스타, 네이버 블로그 모두 Supabase를 바라본다.

### Published 토글
모든 공개 콘텐츠(`design`, `products`)는 `published` 플래그로 노출 제어. 등록은 해두고 나중에 공개하는 워크플로 지원.

### 관리자가 곧 사이트의 일부
moku는 Supabase 대시보드를 직접 다루지 않는다. 모든 등록/편집은 `/admin` 페이지를 통한다.

### 회사·기관 등 외부 데이터 연동 없음
외부 API 의존 최소화. Supabase + Vercel + (자동화 단계에서) 인스타·네이버 API만.

---

## 8. 기술 스택 (참고)

- **프레임워크**: Next.js (App Router)
- **DB & 인증 & Storage**: Supabase
- **배포**: Vercel
- **이메일 알림**: Resend (또는 Supabase Edge Function)
- **시각 디자인 가이드**: 별도 `DESIGN.md`

세부 라이브러리, 폼 처리, 상태관리 등 구현 디테일은 코드 작성 시점에 결정.

---

## 9. v1 완료 기준

다음이 모두 작동하면 v1 출시.

- [ ] moku가 `/admin/login`으로 로그인 가능
- [ ] `/admin/tags`에서 format/field 태그 등록·편집·삭제 가능
- [ ] `/admin/design`에서 작업 신규 등록 (이미지 다중 업로드 + 별표 대표 지정 + 드래그 순서 + 태그 다중 선택) 가능
- [ ] `/admin/design`에서 작업 편집·삭제·공개 토글 가능
- [ ] `/admin/products`에서 제품 등록·편집 가능
- [ ] `/admin/inquiries`에서 문의 확인·status 변경 가능
- [ ] `/design`에서 검색·필터·카드 그리드 동작
- [ ] `/design/{slug}`에서 풀블리드 상세 페이지 동작
- [ ] `/products`에서 제품 카드 그리드 동작
- [ ] 최소 1개 제품의 `/product/{slug}` 마이크로사이트 작동
- [ ] `/contact` 폼 제출 → DB 저장 + 이메일 알림
- [ ] 모든 페이지에 적절한 SEO 메타 태그 (title, description, OG)
- [ ] 모바일 반응형
- [ ] mokuworks.kr 도메인 연결
