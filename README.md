# SKY MATE - 월간 학습코칭 레포트 생성기

학습코칭 데이터를 입력하면 Claude API가 자동으로 피드백을 분류·작성하고, 블루 파스텔 디자인의 월간 레포트를 PDF로 저장할 수 있는 웹앱입니다.

## 기능

- **자동 레포트 생성**: 코칭 원문 텍스트를 Claude API가 학생 피드백, 멘토 피드백, 코칭 방향, 학부모 메시지, 월간 총평으로 자동 분류
- **실시간 미리보기**: 생성된 레포트를 즉시 확인
- **직접 수정**: 모든 텍스트를 클릭하여 직접 편집 가능 (contentEditable)
- **PDF 저장**: 버튼 한 번으로 A4 PDF 다운로드 (`스카이메이트_학생이름_YYYY년MM월.pdf`)
- **반응형 2분할 레이아웃**: 왼쪽 입력 패널 + 오른쪽 레포트 미리보기

## 기술 스택

- Next.js + TypeScript
- Tailwind CSS
- Anthropic Claude API (claude-sonnet-4-20250514)
- html2canvas + jsPDF (PDF 생성)

## 설치 및 실행

```bash
# 저장소 클론
git clone <repository-url>
cd skymate-report

# 의존성 설치
npm install

# 환경변수 설정 (.env.local 파일 생성)
echo "ANTHROPIC_API_KEY=sk-ant-api03-..." > .env.local

# 개발 서버 실행
npm run dev
```

브라우저에서 http://localhost:3000 접속

## 환경변수

| 변수명 | 설명 | 필수 |
|--------|------|------|
| `ANTHROPIC_API_KEY` | Anthropic API 키 | O |

`.env.local` 파일에 설정:

```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

## Vercel 배포

1. GitHub에 저장소 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 Import
3. Environment Variables에 `ANTHROPIC_API_KEY` 추가
4. Deploy 클릭

```bash
# 또는 Vercel CLI 사용
npm i -g vercel
vercel --prod
```

## 사용 방법

1. 왼쪽 패널에서 학생 정보, 수치 데이터 입력
2. 코칭 원문 텍스트에 피드백/메모를 자유롭게 붙여넣기
3. "레포트 생성하기" 클릭
4. 오른쪽 미리보기에서 텍스트 클릭하여 수정
5. "PDF 저장" 버튼으로 다운로드
