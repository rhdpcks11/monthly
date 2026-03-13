import { DailyEntry, DailyRecord } from "@/types";

export function timeToMinutes(time: string): number {
  if (!time || !time.includes(":")) return 0;
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

export function addDays(dateStr: string, days: number): Date {
  // dateStr: "2026-02-16"
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}.${m}.${day}`;
}

export function buildRecords(startDate: string, entries: DailyEntry[]): DailyRecord[] {
  if (!startDate) return [];
  return entries.map((entry, i) => {
    const d = addDays(startDate, i);
    return {
      date: formatDate(d),
      wakeTime: entry.wakeTime || "",
      studyTime: entry.studyTime || "",
      planRate: 0,
    };
  }).filter((r) => r.wakeTime || r.studyTime);
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

  const wakeRecords = records.filter((r) => r.wakeTime);
  const wakeMins = wakeRecords.map((r) => timeToMinutes(r.wakeTime));
  const avgWakeMin = wakeMins.length > 0 ? wakeMins.reduce((a, b) => a + b, 0) / wakeMins.length : 0;
  const avgWakeTime = minutesToHHMM(avgWakeMin);

  const studyRecords = records.filter((r) => r.studyTime);
  const studyMins = studyRecords.map((r) => timeToMinutes(r.studyTime));
  const avgStudyMin = studyMins.length > 0 ? studyMins.reduce((a, b) => a + b, 0) / studyMins.length : 0;
  const avgStudyTime = minutesToHM(avgStudyMin);

  const planRecords = records.filter((r) => r.planRate > 0);
  const avgPlanRate = planRecords.length > 0
    ? Math.round(planRecords.reduce((a, r) => a + r.planRate, 0) / planRecords.length)
    : 0;

  return {
    periodStart,
    periodEnd,
    avgWakeTime,
    avgStudyTime,
    avgStudyMinutes: avgStudyMin,
    avgPlanRate,
  };
}

export function createEmptyEntries(): DailyEntry[] {
  return Array.from({ length: 28 }, () => ({ wakeTime: "", studyTime: "" }));
}
