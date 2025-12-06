# CV Template

> **한국어** | [English](README.md)

**YAML 파일만 수정하면 자동으로 이력서 웹사이트와 PDF가 생성됩니다!**

## 빠른 시작 (5분)

### 1단계: 저장소 Fork
1. 이 저장소를 Fork 하세요
2. Settings → Pages → Source를 **GitHub Actions**로 설정

### 2단계: 내 정보 입력 (cv.yml)
`cv.yml` 파일을 열고 내 정보로 수정하세요:

```yaml
# 기본 정보
profile:
  name: "홍길동"
  title: "백엔드 개발자"
  email: "your.email@example.com"
  github: "github.com/username"
  update: "2025-01-01"

# 자기소개
research_interest: |
  웹 개발에 열정을 가지고 있습니다...

# 기술
skills:
  Programming:
    - "Python, JavaScript"
    - "React, Node.js"
  Languages:
    - "한국어 (원어민)"
    - "영어 (중급)"

# 경력
research_experience:
  - title: "백엔드 개발자"
    duration: "2023년 1월 - 현재"
    organization: "회사명"
    achievements:
      - "API 서버 개발 및 유지보수"
      - "성능 50% 개선"

# 학력
education:
  university: "대학교명"
  duration: "2019년 3월 - 2023년 2월"
  degree: "컴퓨터공학 학사"
  gpa: "4.0 / 4.5"
```

### 3단계: 푸시하면 자동 배포!
수정 후 커밋하면 자동으로:
- PDF 생성
- 웹사이트 배포
- `https://[username].github.io/[repo-name]/`

### 파일 다운로드

배포 완료 후 생성된 파일을 직접 다운로드할 수 있습니다:

**PDF 다운로드:**
```
https://[username].github.io/[repo-name]/data/CV.pdf
```

**Typst 원본 (수정 가능):**
```
https://[username].github.io/[repo-name]/data/cv_output.typ
```

> 우클릭 → "다른 이름으로 링크 저장"으로 다운로드

---

## 작동 원리

```
┌─────────────────────────────────────────────────────────────────┐
│                  사용자 편집 (로컬/GitHub)                          │
├─────────────────────────────────────────────────────────────────┤
│  cv.yml          template.yml        gallery.yml      asset/    │
│  (CV 데이터)      (섹션 설정)            (프로젝트)         (이미지)    │
└────────┬─────────────────┬────────────────┬──────────────┬──────┘
         │                 │                │              │
         └─────────────────┴────────────────┴──────────────┘
                                  │
                         git push to main
                                  │
                                  ▼
         ┌────────────────────────────────────────────────┐
         │         GitHub Actions 워크플로우                 │
         └────────────────────────────────────────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         │                                                 │
         ▼                                                 ▼
┌─────────────────┐                             ┌──────────────────┐
│  Python 빌드     │                             │   웹 빌드          │
├─────────────────┤                             ├──────────────────┤
│ yml2json.py     │                             │ npm install      │
│   ↓             │                             │   ↓              │
│ cv-data.json    │                             │ data/ 복사        │
│ template.json   │                             │ asset/ 복사       │
│ gallery.json    │                             │   ↓              │
│   ↓             │                             │ npm run build    │
│ generate_typst  │                             │   ↓              │
│   ↓             │                             │ web/dist/        │
│ cv_output.typ   │                             └────────┬─────────┘
│   ↓             │                                      │
│ typst compile   │                                      │
│   ↓             │                                      │
│ CV.pdf          │                                      │
└────────┬────────┘                                      │
         │                                               │
         └───────────────────────────────────────────────┘
                                  │
                                  ▼
                     ┌──────────────────────────┐
                     │   GitHub Pages 배포       │
                     └──────────────────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         │                                                 │
         ▼                                                 ▼
┌─────────────────┐                              ┌──────────────────┐
│   웹 UI         │                              │  다운로드 파일       │
├─────────────────┤                              ├──────────────────┤
│ • CV (Web)      │                              │ • CV.pdf         │
│ • CV (PDF)      │                              │ • cv_output.typ  │
│ • Gallery       │                              │ • *.json         │
│ • Dark/Light    │                              └──────────────────┘
└─────────────────┘

         https://[user].github.io/[repo]/
```

---

## 섹션 커스터마이징 (template.yml)

섹션 순서를 바꾸거나, 이름을 변경하거나, 비활성화할 수 있습니다:

```yaml
sections:
  - name: "About Me"           # 표시될 섹션 제목
    template: "text_block"      # 템플릿 종류
    source: "research_interest" # cv.yml의 데이터 키

  - name: "경력"
    template: "experience_list"
    source: "research_experience"

  - name: "숨기고 싶은 섹션"
    template: "awards"
    source: "awards"
    enabled: false              # false로 숨기기
```

### 사용 가능한 템플릿

| 템플릿 | 용도 | 예시 |
|--------|------|------|
| `text_block` | 텍스트 단락 | 자기소개, 요약 |
| `skills_list` | 카테고리별 목록 | 기술 스택 |
| `experience_list` | 타임라인 형식 | 경력, 프로젝트 |
| `education` | 학력 정보 | 대학교 |
| `awards` | 수상 내역 | 장학금, 상 |
| `single_entry` | 단일 항목 | 병역 |

자세한 필드 설명: [docs/templates.md](docs/templates.md)

---

## 프로젝트 갤러리 (gallery.yml)

```yaml
project_highlights:
  - title: "프로젝트 이름"
    image: "asset/screenshot.png"
    period: "2024.01"
    descriptions:
      - "주요 기능 설명"
    custom_tag: "React, TypeScript"
    is_team: true
```

---

## 로컬 개발 (선택)

```bash
# 1. 의존성 설치
pip install -r requirements.txt
cd web && npm install && cd ..

# 2. PDF 및 JSON 생성
./scripts/compile.sh

# 3. 로컬 미리보기
cd web && npm run dev
```

---

## 구조

```
├── cv.yml           # 내 이력서 데이터
├── template.yml     # 섹션 설정
├── gallery.yml      # 갤러리 데이터
├── scripts/         # 빌드 스크립트
├── typst/           # PDF 생성기
└── web/             # 웹 UI
```