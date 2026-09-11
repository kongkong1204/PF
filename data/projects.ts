export type Project = {
  slug: string
  title: string
  summary: string
  techStack: string[]
  githubUrl?: string
  awardUrl?: string
  highlight: string
  description: string
  accentColor: string
}

export const projects: Project[] = [
  {
    slug: 'cruxfinder',
    title: 'CruxFinder',
    summary: 'Flutter 기반 클라이밍 루트 추천 앱',
    techStack: ['Flutter', 'Dart', 'Python', 'Roboflow', 'A* Algorithm'],
    githubUrl: 'https://github.com/kongkong1204/CruxFinder',
    highlight: '졸업작품 — 컴퓨터 비전으로 홀드를 인식하고 A* 경로 탐색으로 최적 루트를 자동 제안',
    description: `클라이밍 입문자가 루트(문제)를 파악하기 어렵다는 문제에서 출발했습니다.
Roboflow 컴퓨터 비전 모델로 벽면의 홀드를 인식하고,
A* 경로탐색 알고리즘으로 시작 홀드에서 탑홀드까지의 최적 경로를 계산해 추천합니다.
Flutter로 크로스플랫폼 앱을 구현해 iOS/Android 모두 지원합니다.`,
    accentColor: '#16a34a',
  },
  {
    slug: 'hyojason',
    title: '효자손',
    summary: '사회복지 사각지대 노인을 위한 앱',
    techStack: ['AppSheet', 'Google Sheets'],
    awardUrl: 'https://www.gnict.org/게시판/sw경진대회/경남-sw경진대회-결과/',
    highlight: '경남 SW경진대회 수상작 — 노코딩 플랫폼으로 실제 서비스 수준의 앱 구현',
    description: `사회복지 사각지대에 놓인 노인분들이 필요한 복지 서비스를 쉽게 찾고 신청할 수 있도록 돕는 앱입니다.
구글 노코딩 플랫폼 AppSheet를 활용해 빠르게 프로토타입을 구현했으며,
경남 SW경진대회에서 수상하는 성과를 거뒀습니다.`,
    accentColor: '#2563eb',
  },
  {
    slug: 'mesojang',
    title: '메소장',
    summary: '메이플스토리 경매장 시세 추적 웹',
    techStack: ['Vanilla JS', 'SVG'],
    highlight: '약 52주치 시세 데이터를 외부 라이브러리 없이 inline SVG로 시각화',
    description: `메이플스토리 인게임 경매장의 아이템 시세를 추적하고 시각화하는 웹 서비스입니다.
순수 Vanilla JS와 inline SVG만으로 약 52주치 가격 데이터를 차트로 표현했습니다.
외부 의존성 없이 정적 파일로만 동작하는 것이 특징입니다.`,
    accentColor: '#dc2626',
  },
  {
    slug: 'traffic-light-recognition',
    title: '야간 신호등 인식',
    summary: '빛 번짐 현상을 이용한 야간 교통신호등 색상 인식',
    techStack: ['Python', 'OpenCV', 'NumPy', 'Matplotlib'],
    githubUrl: 'https://github.com/kongkong1204/traffic_light-imageProcess-',
    highlight: '논문 "야간 영상에서의 빛 번짐 현상을 이용한 교통신호등 인식"(김민기, 2017) 재현 — 링(Ring) 탐색 알고리즘으로 빛 번짐 색상을 추출해 신호등 색을 판별',
    description: `야간 영상에서는 신호등 불빛 주변에 빛 번짐(glow)이 생겨 단순 색상 검출로는 오검출이 잦다는 문제에서 출발했습니다.
HSV로 변환한 영상의 V채널을 이진화해 점등 후보 영역을 찾고, 크기·원형도·종횡비 필터로 배경 노이즈를 제거합니다.
이후 후보 영역 주변에서 채도가 가장 높은 링(Ring)을 탐색해 빛 번짐의 실제 색상을 추출하고,
HSV 조건표와 RGB 보정표를 함께 적용해 red/yellow/green을 판별합니다.
OpenCV와 NumPy 벡터 연산으로 파이프라인을 구현하고 Matplotlib으로 검출 결과를 시각화했습니다.`,
    accentColor: '#f59e0b',
  },
]
