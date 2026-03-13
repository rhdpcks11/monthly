export interface DailyEntry {
  wakeTime: string;   // "06:35"
  studyTime: string;  // "10:23"
}

export interface DailyRecord {
  date: string;       // "2026.02.16"
  wakeTime: string;
  studyTime: string;
  planRate: number;
}

export interface ReportInput {
  studentName: string;
  year: number;
  month: number;
  coachingMonth: number;
  mentorName: string;
  taskCompletionRate: number;
  taskCompletionDelta: number;
  weeklyRates: [number, number, number, number];
  studentFeedback: string;
  mentorSummary: string;
  directions: string;
  parentMessage: string;
  rawText: string;
  // 일별 데이터
  startDate: string;  // "2026-02-16" (input date 형식)
  dailyEntries: DailyEntry[];
}

export interface GeneratedContent {
  student_feedback: string;
  mentor_summary: string;
  directions: string[];
  parent_message: string;
}

export interface ReportData {
  studentName: string;
  year: number;
  month: number;
  coachingMonth: number;
  mentorName: string;
  taskCompletionRate: number;
  taskCompletionDelta: number;
  weeklyRates: [number, number, number, number];
  studentFeedback: string;
  mentorSummary: string;
  directions: string[];
  parentMessage: string;
  dailyRecords: DailyRecord[];
  periodStart: string;
  periodEnd: string;
  avgWakeTime: string;
  avgStudyTime: string;
  avgStudyMinutes: number;
  avgPlanRate: number;
}
