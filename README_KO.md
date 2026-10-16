# K95 Mainrenewal

K95 사이트를 분석한 내용을 바탕으로 작성한 로컬 웹사이트입니다. 원본의 작품 20개, 로고, Adaptive 폰트와 프로젝트별 이미지를 포함합니다. `JCodesMore/ai-website-cloner-template`의 Next.js 16 / React 19 / TypeScript 템플릿을 기반으로 작성했습니다.

## 바로 실행

1. 이 폴더의 **START.cmd**를 더블 클릭합니다.
2. 브라우저에서 **http://localhost:3000/en/** 을 엽니다.
3. 사용하는 동안 실행 창을 열어 둡니다. 종료하려면 Ctrl+C를 누릅니다.

빌드된 `out/` 폴더를 포함하므로 제공된 컴퓨터에서는 추가 설치 없이 실행할 수 있습니다. Node.js가 필요하며, START.cmd는 PATH의 Node.js 또는 이 컴퓨터의 Codex Node.js를 사용합니다. HTML 파일을 파일 탐색기에서 직접 여는 대신 HTTP 주소를 사용하세요.

## 코드 수정 및 빌드

Node.js 24 이상과 pnpm을 설치한 일반 개발 환경:

```powershell
cd C:\Users\user\Desktop\2601110264\K95_Mainrenewal
pnpm install
pnpm dev
```

개발 주소: http://localhost:3000/en/

```powershell
pnpm check       # ESLint + TypeScript + production build
pnpm preview     # 최종 out/ 폴더를 로컬 서버로 실행
```

이 컴퓨터에서는 npm 명령이 PATH에 없어 번들 pnpm으로 의존성을 설치했습니다. pnpm이 PATH에 없으면 다음 명령을 사용할 수 있습니다.

```powershell
& 'C:\Users\user\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' dev
```

## 구현한 화면과 기능

- 홈: Three.js 3D 갤러리, Rings / Spiral 전환, 휠·가로/세로 드래그·방향키 탐색, 작품 클릭 이동, 금속 로고, 포인터 반응.
- Works: 작품 20개, Grid / List, 6가지 분야 선택과 실제 결과 수 표시.
- 프로젝트 상세: 프로젝트별 설명, 커버 및 추가 이미지, 다음 프로젝트 이동.
- Studio: 소개, 서비스 아코디언, 팀 정보.
- Contact: 주소와 이메일 링크.
- 모바일 메뉴, 키보드 포커스 이동, 쿠키 설정 저장, 동작 줄이기 설정 대응, WebGL 실패 시 이미지 목록 대체 화면.

## 자주 수정하는 파일

| 파일 | 수정 내용 |
| --- | --- |
| `src/components/sites/k95/projects.json` | 작품 제목·설명·분류·이미지 |
| `src/components/sites/k95/GalleryScene.tsx` | 3D 위치·움직임·카메라 |
| `src/components/sites/k95/Home.tsx` | 홈 조작부·하단 정보 |
| `src/components/sites/k95/Works.tsx` | 목록·필터 |
| `src/components/sites/k95/Shell.tsx` | 공통 메뉴·푸터·쿠키 안내 |
| `src/app/k95.css` | 색상·글꼴·레이아웃·모바일 스타일 |
| `src/app/en/` | 개별 페이지 |
| `public/sites/k95/` | 이미지·로고·폰트 |

## 원본과 차이

원본의 정확한 3D 모델·셰이더·카메라 궤적·페이지 전환을 복사한 것은 아닙니다. 로고 SVG를 입체화하고 이미지 평면을 배치해 새로 구현했습니다. Works는 DOM 기반 반응형 목록이며, 상세 페이지는 각 프로젝트 이미지 4장으로 구성했습니다. Studio의 팀 사진·수상 목록과 일부 원본 모션은 포함하지 않습니다. 원본 영문 페이지에 이탈리아어로 작성된 일부 설명은 원문을 유지했습니다.

IT 버튼은 원본 이탈리아어 사이트로 연결합니다. 이메일·지도·SNS·상점은 외부 링크입니다. 분석/광고 스크립트는 포함하지 않았으며 개인정보 페이지는 이 로컬 구현에 맞춘 안내입니다. 원본과 픽셀 단위 일치를 주장하지 않습니다.

## 출처

- 템플릿: https://github.com/JCodesMore/ai-website-cloner-template (MIT, LICENSE 유지)
- 디자인 및 콘텐츠: https://k95.it/en
- 에셋 출처: `docs/research/k95/asset-map.json`
- 구현 범위: `docs/research/k95/implementation.md`

브랜드·폰트·작품·이미지의 권리는 원 저작권자에게 있습니다. 이 프로젝트의 MIT 템플릿 라이선스가 원본 에셋의 사용권을 부여하지는 않습니다.
