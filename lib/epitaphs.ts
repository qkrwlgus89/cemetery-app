const EPITAPHS = [
  "의지는 있었다, 실천은 없었다",
  "3일은 버텼다",
  "시작이 반이었다, 나머지 반은 없었다",
  "새벽 4시 결심, 8시에 취소",
  "다음 생에 다시 만나자",
  "잠시 안녕",
  "포기도 용기다",
  "현실과 이상의 사이에서",
  "아무도 보지 않았다",
  "유튜브가 방해했다",
  "내일 다시 결심하겠습니다",
  "배달앱이 문제였다",
  "이불 밖은 위험했다",
  "갑자기 바빠졌다",
  "몸이 먼저 알았다",
  "마음만은 운동선수였다",
  "다이어트는 내일부터",
  "공부는 분위기 탄다",
  "의욕은 소모품이다",
  "끝까지 간 사람도 있다더라",
  "열심히 고민했다",
  "계획은 완벽했다",
  "환경이 문제였다",
  "타이밍이 맞지 않았다",
  "다음 달엔 꼭",
];

const ZERO_DAY_EPITAPHS = [
  "결심과 포기가 동시에",
  "태어나자마자 숨졌다",
  "찰나의 용기였다",
  "시작도 끝도 오늘이었다",
  "빛보다 빠른 포기",
];

export function getRandomEpitaph(survivedDays: number): string {
  if (survivedDays === 0) {
    return ZERO_DAY_EPITAPHS[Math.floor(Math.random() * ZERO_DAY_EPITAPHS.length)];
  }
  return EPITAPHS[Math.floor(Math.random() * EPITAPHS.length)];
}
