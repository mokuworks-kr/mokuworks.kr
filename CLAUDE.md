# mokuworks

1인 메이커 통합 브랜드 사이트. 그래픽 디자인 외주 + 자체 웹앱 제품을 한 사이트에서 운영.

## Required Reading

작업 시작 전 다음 두 문서를 항상 먼저 읽는다. 두 문서가 이 프로젝트의 SSOT이다.

- `SPEC.md` — 정체성, 정보 구조, 데이터 모델, 페이지별 동작
- `DESIGN.md` — 색, 폰트, 컴포넌트, 인터랙션, 시각 시스템

**충돌 시 SPEC.md가 우선.** DESIGN.md는 시각 표현만 결정한다.

## Stack

- Next.js (App Router) + TypeScript strict
- Supabase (DB, Auth, Storage)
- Tailwind CSS (DESIGN.md 토큰을 `tailwind.config.js`에 매핑)
- Vercel 배포
- pnpm 패키지 매니저

## Workflow Rules

### 코드 작성 전
- 관련 파일을 먼저 read. 추측 금지.
- SPEC/DESIGN에 명시된 결정을 임의로 바꾸지 않는다. 변경이 필요하면 먼저 user에게 확인 후 SPEC/DESIGN을 업데이트, 그 다음 코드 작업.

### 코드 작성 중
- DESIGN.md의 토큰만 사용. 인라인 색상값(`#abc123`), 임의 spacing, 임의 폰트 사이즈 금지.
- 새 npm 패키지 추가는 user 확인 후. 가능하면 기존 의존성으로 해결.
- 파일 100줄 넘으면 분리 검토. 500줄 넘으면 무조건 분리.

### 코드 작성 후
- 변경 후 `pnpm typecheck`와 `pnpm lint` 통과 확인.
- 빌드 에러 없는지 `pnpm build` 검증.
- 한 작업 단위가 끝나면 git commit 제안 (사용자가 직접 커밋, AI는 commit 명령 실행하지 않음).

## Hard Don'ts

- DO NOT 임의로 SPEC.md/DESIGN.md를 수정하지 않는다. user 동의 필수.
- DO NOT 인라인 스타일에 색상/폰트/spacing 하드코딩.
- DO NOT 새 라이브러리 임의 추가.
- DO NOT 환경변수, 시크릿, API 키를 코드에 하드코딩하거나 로그로 남김.
- DO NOT `git push --force`, `git rebase` 등 파괴적 git 명령 실행.
- DO NOT 사용자 확인 없이 데이터베이스 스키마 변경, 데이터 삭제 작업 실행.

## Conventions

### 파일 구조
- `app/` — Next.js App Router 라우트
- `components/` — 재사용 컴포넌트 (PascalCase)
- `lib/` — 유틸리티, Supabase 클라이언트
- `types/` — TypeScript 타입 정의
- `app/admin/` — 관리자 페이지 (Auth 보호)

### Naming
- 컴포넌트: PascalCase (`ProjectCard.tsx`)
- 함수/변수: camelCase
- 상수: SCREAMING_SNAKE_CASE
- 파일명: 컴포넌트는 PascalCase, 그 외 kebab-case

### Imports
1. React/Next 내장
2. 외부 라이브러리
3. 내부 (`@/components`, `@/lib` 등)
4. 타입 (`import type`)
5. 스타일

각 그룹 사이 빈 줄.

### Supabase
- 클라이언트는 `lib/supabase/client.ts` (브라우저), `lib/supabase/server.ts` (서버) 분리.
- 모든 DB 쿼리는 타입 안전하게 (`Database` 타입 자동 생성 활용).
- RLS(Row Level Security) 적용. 관리자 작업은 service role 키 사용.

## Progress Tracking

`SPEC.md` 9번 섹션의 v1 완료 기준 체크리스트를 진행 가이드로 사용.
새 항목 완료 시 사용자에게 보고 (체크리스트 자체는 사용자가 직접 업데이트).

## When Stuck

- SPEC/DESIGN에서 답을 못 찾으면 추측하지 말고 user에게 질문.
- 두 가지 이상의 합리적 접근이 있으면 user에게 선택지 제시.
- 임시 해결책(`TODO`, `FIXME`)은 명시적으로 표시하고 user에게 알림.
