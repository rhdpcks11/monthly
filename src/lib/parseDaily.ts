import { DailyRecord } from "@/types";

export function parseDailyData(text: string): DailyRecord[] {
  const lines = text.trim().split("\n");
  const records: DailyRecord[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("날짜") || trimmed.startsWith("예시")) continue;

    const parts = trimmed.split(",").map((s) => s.trim());
    if (parts.length < 4) continue;

    const date = parts[0];
    const wakeTime = parts[1];
    const studyTime = parts[2];
    const planRate = parseFloat(parts[3]);

    if (!date.match(/\d{4}\.\d{2}\.\d{2}/) || isNaN(planRate)) continue;

    records.push({ date, wakeTime, studyTime, planRate });
  }

  return records;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

export function minutesToHHMM(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = Math.round(totalMin % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function minutesToHM(totalMin: number): string {
  const h = Math.floor(totalMin / 60);
  const m = Math.round(totalMin % 60);
  return `${h}H ${m}M`;
}

export function calcStats(records: DailyRecord[]) {
  if (records.length === 0) {
    return {
      periodStart: "",
      periodEnd: "",
      avgWakeTime: "00:00",
      avgStudyTime: "0H 0M",
      avgStudyMinutes: 0,
      avgPlanRate: 0,
    };
  }

  const periodStart = records[0].date;
  const periodEnd = records[records.length - 1].date;

  // 평균 기상 시간
  const wakeMins = records.map((r) => timeToMinutes(r.wakeTime));
  const avgWakeMin = wakeMins.reduce((a, b) => a + b, 0) / wakeMins.length;
  const avgWakeTime = minutesToHHMM(avgWakeMin);

  // 평균 공부 시간
  const studyMins = records.map((r) => timeToMinutes(r.studyTime));
  const avgStudyMin = studyMins.reduce((a, b) => a + b, 0) / studyMins.length;
  const avgStudyTime = minutesToHM(avgStudyMin);

  // 평균 계획 달성도
  const avgPlanRate = Math.round(
    records.reduce((a, r) => a + r.planRate, 0) / records.length
  );

  return {
    periodStart,
    periodEnd,
    avgWakeTime,
    avgStudyTime,
    avgStudyMinutes: avgStudyMin,
    avgPlanRate,
  };
}
