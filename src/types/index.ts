export interface DailyRecord {
  date: string;       // "2026.02.16"
  wakeTime: string;   // "06:35"
  studyTime: string;  // "10:23"
  planRate: number;    // 90
}

export interface ReportInput {
  studentName: string;
  year: number;
  month: number;
  coachingMonth: number;
  mentorName: string;
  taskCompletionRate: number;
  taskCompletionDelta: number;
  totalStudyHours: number;
  dailyAvgHours: number;
  wakeUpDays: number;
  totalDays: number;
  weeklyRates: [number, number, number, number];
  studentFeedback: string;
  mentorSummary: string;
  directions: string;
  parentMessage: string;
  rawText: string;
  dailyDataText: string;
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
  totalStudyHours: number;
  dailyAvgHours: number;
  wakeUpDays: number;
  totalDays: number;
  weeklyRates: [number, number, number, number];
  studentFeedback: string;
  mentorSummary: string;
  directions: string[];
  parentMessage: string;
  dailyRecords: DailyRecord[];
  // 계산된 통계
  periodStart: string;
  periodEnd: string;
  avgWakeTime: string;
  avgStudyTime: string;
  avgStudyMinutes: number;
  avgPlanRate: number;
}
