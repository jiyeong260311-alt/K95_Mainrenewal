# K95 — 바닐라 JavaScript 버전

React, Next.js, JSX, TypeScript, npm 설치, 빌드 과정 없이 실행하는 HTML/CSS/JavaScript 웹사이트입니다. 기존 버전의 디자인·작품 20개·이미지·폰트와 주요 기능을 옮겼습니다. 3D 렌더링에만 Three.js를 사용하며 해당 라이브러리도 `vendor/` 폴더에 포함되어 있어 외부 CDN에 의존하지 않습니다.

## 실행

1. **START.cmd** 더블 클릭.
2. **http://localhost:3001/** 접속.
3. 종료하려면 실행 창에서 Ctrl+C.

Node.js가 설치되어 있으면 `node serve.mjs`로도 실행할 수 있습니다. START.cmd는 PATH의 Node.js가 없으면 현재 컴퓨터의 Codex Node.js를 사용합니다. 기존 Next.js 사이트의 3000번 포트와 겹치지 않도록 3001번 포트를 사용합니다.

VS Code Live Server나 Python 정적 서버로도 실행할 수 있습니다.

```powershell
python -m http.server 3001
```

JavaScript ES 모듈을 사용하므로 index.html을 파일 탐색기에서 직접 여는 방식 대신 HTTP 서버로 실행하세요. 인터넷 연결이나 패키지 설치·빌드는 필요하지 않습니다. 이메일·SNS·지도·IT 링크 등 외부 사이트는 인터넷 연결이 필요합니다.

## 수정할 파일

| 파일 | 내용 |
| --- | --- |
| `index.html` | 기본 HTML·메뉴·import map |
| `css/style.css` | 디자인·반응형 스타일 |
| `js/app.js` | DOM 렌더링·해시 라우터·메뉴·필터·상세 페이지·쿠키 설정 |
| `js/gallery.js` | Three.js 3D 갤러리·Rings/Spiral·마우스/터치/휠/키보드 |
| `js/data.js` | 작품 데이터·이미지 경로·서비스·팀 정보 |
| `assets/` | 원본 이미지·로고·Adaptive 폰트 |
| `vendor/` | 로컬 Three.js 및 MIT 라이선스 |
| `serve.mjs` | Node.js 내장 모듈만 사용하는 정적 서버 |

## 화면 주소

- 홈: `/#/`
- 전체 작품: `/#/works`
- 상세: `/#/projects/mn-motorcycle-helmet-company`
- 소개: `/#/studio`
- 문의: `/#/contacts`
- 개인정보: `/#/privacy`

해시 라우팅으로 구성해 일반 정적 호스팅에 그대로 올릴 수 있으며 서버의 경로 재작성 설정이 필요하지 않습니다. 프로젝트 설명에 포함된 일부 이탈리아어는 원본을 유지했습니다.

## 구현 범위

홈의 3D 갤러리, 작품 배치 전환, 드래그·휠·방향키 탐색, Grid/List 전환, 분야별 필터, 프로젝트 상세와 다음 작품 연결, 모바일 메뉴, 서비스 아코디언, 쿠키 설정과 포커스 처리를 구현했습니다. 화면 이동 시 WebGL 리소스와 이벤트를 정리합니다. 동작 줄이기 설정을 반영하며 WebGL을 사용할 수 없으면 이미지 목록으로 대체합니다.

원본의 정확한 3D 모델·셰이더·전환 효과와 일치하는 복제는 아닙니다. 기존 Next.js 버전과 마찬가지로 상세 이미지는 프로젝트당 4장, Studio는 소개·서비스·팀 텍스트 중심으로 구성했습니다. IT는 원본 이탈리아어 사이트로 연결됩니다. 분석·광고 추적 코드는 포함하지 않았습니다.

디자인·이미지·로고·폰트 출처: https://k95.it/en. 해당 에셋의 권리는 원 저작권자에게 있습니다. `docs/source-assets.json`은 이전 프로젝트의 에셋 출처 기록이며, 이 버전의 실제 파일 경로는 `assets/`입니다. Three.js의 MIT 라이선스는 `vendor/THREE-LICENSE.txt`에 있습니다.
