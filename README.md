# 콘서트 티켓팅 플랫폼

이 프로젝트는 [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app)으로 생성된 [Next.js](https://nextjs.org) 프로젝트입니다.

## 프로젝트 개요

이 프로젝트는 콘서트 공연장의 티켓팅을 도와주는 웹 플랫폼으로, 사용자에 따라서 예매를 하거나 공연장 좌석 배치를 직접 편집할 수 있는 기능을 제공하며, 다음과 같은 기술 스택을 사용합니다

- **Next.js** (Page Router) - React의 프레임워크로, 기본적으로 정적 사이트 생성(SSG)을 사용하며, 필요 시 `getServerSideProps`를 통해 서버 사이드 렌더링(SSR) 구현 가능
- **TypeScript** - Javascript 기반의 type을 사용한 안전한 언어
- **Tailwind CSS** - 모던한 반응형 디자인

## 개발 시작하기

먼저, Yarn을 사용하여 의존성을 설치합니다:

```bash
  yarn
```

그리고 `main` branch에서 pull을 받아오세요.
```bash
  git pull origin main
```
마지막으로 next.js 로컬 서버를 실행
```bash
  yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## 페이지 수정

`pages/index.tsx` 파일을 수정하여 페이지를 편집할 수 있습니다. 파일을 수정하면 페이지가 자동으로 업데이트됩니다.

## API 라우트

API 라우트는 [http://localhost:3000/api/hello](http://localhost:3000/api/hello)에서 접근할 수 있습니다. 이 엔드포인트는 `pages/api/hello.ts` 파일에서 수정할 수 있습니다.

`pages/api` 디렉토리는 `/api/*`로 매핑됩니다. 이 디렉토리의 파일은 React 페이지가 아닌 [API 라우트](https://nextjs.org/docs/pages/building-your-application/routing/api-routes)로 처리됩니다.

## 폰트 최적화

이 프로젝트는 [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts)를 사용하여 [Geist](https://vercel.com/font) 폰트를 자동으로 최적화하고 로드합니다.

## 더 알아보기

Next.js에 대해 더 알아보려면 다음 자료를 참고하세요:

- [Next.js 공식 문서](https://nextjs.org/docs) - Next.js 기능과 API에 대해 알아보기
- [Next.js 학습 자료](https://nextjs.org/learn-pages-router) - 인터랙티브 Next.js 튜토리얼

[Next.js GitHub 저장소](https://github.com/vercel/next.js)를 확인해보세요. 피드백과 기여는 언제나 환영입니다!

## Vercel에 배포하기

Next.js 앱을 배포하는 가장 쉬운 방법은 Next.js를 만든 [Vercel 플랫폼](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)을 사용하는 것입니다.

[Next.js 배포 문서](https://nextjs.org/docs/pages/building-your-application/deploying)에서 더 자세한 내용을 확인할 수 있습니다.

## 기타 참고자료

[다양한 무료 아이콘 사이트](https://icon-sets.iconify.design/)
[티켓링크, 벤치마킹 사이트](https://www.ticketlink.co.kr/global/en/home)
