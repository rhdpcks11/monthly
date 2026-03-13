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
  // 직접 입력 필드
  studentFeedback: string;
  mentorFeedback: string;
  directions: string;
  parentMessage: string;
  summaryP1: string;
  summaryP2: string;
  // AI 자동생성용 (선택)
  rawText: string;
}

export interface GeneratedContent {
  student_feedback: string;
  mentor_feedback: string;
  directions: string[];
  parent_message: string;
  summary_p1: string;
  summary_p2: string;
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
  mentorFeedback: string;
  directions: string[];
  parentMessage: string;
  summaryP1: string;
  summaryP2: string;
}
