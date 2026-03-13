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
  // 직접 입력 필드 (4개)
  studentFeedback: string;
  mentorSummary: string;
  directions: string;
  parentMessage: string;
  // AI 자동생성용
  rawText: string;
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
}
