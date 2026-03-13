"use client";

import { ReportData } from "@/types";
import { timeToMinutes, minutesToHM } from "@/lib/parseDaily";

interface Props {
  data: ReportData | null;
}

function EditableText({
  text,
  className = "",
  tag: Tag = "p",
}: {
  text: string;
  className?: string;
  tag?: "p" | "span" | "h2" | "h3" | "div";
}) {
  return (
    <Tag
      contentEditable
      suppressContentEditableWarning
      className={`outline-none focus:ring-2 focus:ring-sky-200 focus:rounded px-1 -mx-1 editable-hint ${className}`}
    >
      {text}
    </Tag>
  );
}

/* 기상시간 → 색상 (빠를수록 진한 파랑) */
function wakeColor(time: string): string {
  const min = timeToMinutes(time);
  // 5:00=300 ~ 9:00=540 범위
  const ratio = Math.max(0, Math.min(1, (min - 300) / 240));
  // 0(빠름)→진한파랑, 1(늦음)→연한파랑
  const lightness = 40 + ratio * 45; // 40% ~ 85%
  return `hsl(210, 80%, ${lightness}%)`;
}

function formatShortDate(dateStr: string) {
  const parts = dateStr.split(".");
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  return `${m}/${d}`;
}

export default function ReportPreview({ data }: Props) {
  const handlePDF = () => {
    window.print();
  };

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg viewBox="0 0 100 100" width={64} height={64} className="mx-auto mb-4 opacity-20">
            <defs>
              <linearGradient id="emptyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7DD3FC" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <polygon points="50,5 72,22 64,22 50,13 36,22 28,22" fill="url(#emptyGrad)" />
            <polygon points="28,22 36,22 36,46 28,40" fill="url(#emptyGrad)" />
            <polygon points="36,38 50,38 50,46 36,46" fill="url(#emptyGrad)" />
            <polygon points="50,54 64,54 64,62 50,62" fill="url(#emptyGrad)" />
            <polygon points="72,60 64,60 64,78 72,78" fill="url(#emptyGrad)" />
            <polygon points="50,95 28,78 36,78 50,87 64,78 72,78" fill="url(#emptyGrad)" />
          </svg>
          <p className="text-gray-400 text-sm">왼쪽 패널에서 정보를 입력하고</p>
          <p className="text-gray-400 text-sm">&ldquo;레포트 미리보기&rdquo; 버튼을 눌러주세요.</p>
        </div>
      </div>
    );
  }

  const deltaSign = data.taskCompletionDelta >= 0 ? "+" : "";
  const deltaColor = data.taskCompletionDelta >= 0 ? "text-emerald-500" : "text-red-400";
  const today = new Date();
  const formattedDate = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  const hasDaily = data.dailyRecords.length > 0;

  // 공부시간 차트 계산
  const studyMins = data.dailyRecords.map((r) => timeToMinutes(r.studyTime));
  const maxStudy = Math.max(...studyMins, 1);

  // 기상시간 그리드: 첫날의 요일 계산
  let startDayOfWeek = 0;
  if (hasDaily) {
    const parts = data.dailyRecords[0].date.split(".");
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    startDayOfWeek = d.getDay(); // 0=일 1=월 ...
  }

  // 미니 헤더 (2페이지용)
  const MiniHeader = () => (
    <div className="report-section px-6 py-3 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2D4A7A 40%, #3B5998 100%)" }}>
      <div className="flex items-center gap-2">
        <svg viewBox="0 0 100 100" width={20} height={20}>
          <defs><linearGradient id="miniGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7DD3FC" /><stop offset="100%" stopColor="#BAE6FD" /></linearGradient></defs>
          <polygon points="50,5 72,22 64,22 50,13 36,22 28,22" fill="url(#miniGrad)" />
          <polygon points="28,22 36,22 36,46 28,40" fill="url(#miniGrad)" />
          <polygon points="36,38 50,38 50,46 36,46" fill="url(#miniGrad)" />
          <polygon points="50,54 64,54 64,62 50,62" fill="url(#miniGrad)" />
          <polygon points="72,60 64,60 64,78 72,78" fill="url(#miniGrad)" />
          <polygon points="50,95 28,78 36,78 50,87 64,78 72,78" fill="url(#miniGrad)" />
        </svg>
        <span className="text-white text-sm font-bold">{data.studentName} 학생</span>
        <span className="text-sky-300 text-xs">| {data.year}년 {data.month}월</span>
      </div>
      {hasDaily && <span className="text-sky-200 text-xs">{data.periodStart} ~ {data.periodEnd}</span>}
    </div>
  );

  return (
    <div className="h-screen overflow-y-auto bg-gray-100">
      {/* PDF 버튼 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-3 flex justify-end print-hide">
        <button
          onClick={handlePDF}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg text-sm font-semibold hover:from-sky-500 hover:to-blue-600 shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          PDF 저장
        </button>
      </div>

      <div className="p-6">
        <div id="report-content" className="max-w-[800px] mx-auto bg-white rounded-2xl shadow-lg overflow-hidden print-root">

          {/* ===== 헤더 ===== */}
          <div className="report-section px-8 py-8" style={{ background: "linear-gradient(135deg, #1E3A5F 0%, #2D4A7A 40%, #3B5998 100%)" }}>
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 100 100" width={40} height={40}>
                <defs><linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7DD3FC" /><stop offset="100%" stopColor="#BAE6FD" /></linearGradient></defs>
                <polygon points="50,5 72,22 64,22 50,13 36,22 28,22" fill="url(#headerGrad)" />
                <polygon points="28,22 36,22 36,46 28,40" fill="url(#headerGrad)" />
                <polygon points="36,38 50,38 50,46 36,46" fill="url(#headerGrad)" />
                <polygon points="50,54 64,54 64,62 50,62" fill="url(#headerGrad)" />
                <polygon points="72,60 64,60 64,78 72,78" fill="url(#headerGrad)" />
                <polygon points="50,95 28,78 36,78 50,87 64,78 72,78" fill="url(#headerGrad)" />
              </svg>
              <div>
                <h1 className="text-white text-xl font-bold tracking-wide">SKY MATE</h1>
                <p className="text-sky-200 text-xs">월간 학습코칭 레포트</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sky-300 text-xs mb-1">코칭 {data.coachingMonth}개월차</p>
                <h2 className="text-white text-2xl font-bold">{data.studentName} 학생</h2>
              </div>
              <div className="text-right">
                <p className="text-white text-lg font-bold">{data.year}년 {data.month}월</p>
                {hasDaily && (
                  <p className="text-sky-200 text-xs mt-1">기간: {data.periodStart} ~ {data.periodEnd}</p>
                )}
                <p className="text-sky-300 text-xs mt-0.5">담당 멘토: {data.mentorName}</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">

            {/* ===== 통계 카드 (일별 데이터 기반) ===== */}
            {hasDaily && (
              <div className="report-section grid grid-cols-3 gap-4">
                <div className="bg-sky-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-sky-600 font-semibold mb-1">월 평균 기상 시간</p>
                  <p className="text-2xl font-bold text-sky-700">{data.avgWakeTime}</p>
                </div>
                <div className="bg-violet-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-violet-600 font-semibold mb-1">월 평균 공부 시간</p>
                  <p className="text-2xl font-bold text-violet-700">{data.avgStudyTime}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <p className="text-xs text-blue-600 font-semibold mb-1">월 평균 계획 달성도</p>
                  <p className="text-2xl font-bold text-blue-700">{data.avgPlanRate}%</p>
                </div>
              </div>
            )}

            {/* ===== 수치 카드 (수동 입력) ===== */}
            <div className="report-section grid grid-cols-3 gap-4">
              <div className="bg-sky-50 rounded-xl p-4 text-center">
                <p className="text-xs text-sky-600 font-semibold mb-1">과제 완료율</p>
                <p className="text-3xl font-bold text-sky-700">{data.taskCompletionRate}%</p>
                <p className={`text-xs font-semibold mt-1 ${deltaColor}`}>
                  전월 대비 {deltaSign}{data.taskCompletionDelta}%p
                </p>
              </div>
              <div className="bg-violet-50 rounded-xl p-4 text-center">
                <p className="text-xs text-violet-600 font-semibold mb-1">총 학습시간</p>
                <p className="text-3xl font-bold text-violet-700">{data.totalStudyHours}h</p>
                <p className="text-xs text-violet-400 mt-1">일 평균 {data.dailyAvgHours}h</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-xs text-blue-600 font-semibold mb-1">기상 인증</p>
                <p className="text-3xl font-bold text-blue-700">{data.wakeUpDays}일</p>
                <p className="text-xs text-blue-400 mt-1">
                  / {data.totalDays}일 ({data.totalDays > 0 ? Math.round((data.wakeUpDays / data.totalDays) * 100) : 0}%)
                </p>
              </div>
            </div>

            {/* ===== 주차별 완료율 바 차트 ===== */}
            <div className="report-section bg-gray-50 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4">주차별 과제 완료율</h3>
              <div className="space-y-3">
                {data.weeklyRates.map((rate, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-500 w-10">{i + 1}주차</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${rate}%`, background: "linear-gradient(90deg, #7DD3FC, #818CF8)" }} />
                    </div>
                    <span className="text-xs font-bold text-gray-600 w-10 text-right">{rate}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ===== 기상 시간 그리드 ===== */}
            {hasDaily && (
              <div className="report-section bg-gray-50 rounded-xl p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-4">기상 시간 기록</h3>
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["일", "월", "화", "수", "목", "금", "토"].map((d) => (
                    <div key={d} className="text-center text-xs font-semibold text-gray-400 py-1">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {/* 첫날 이전 빈 칸 */}
                  {Array.from({ length: startDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square rounded-lg bg-gray-100" />
                  ))}
                  {/* 실제 데이터 */}
                  {data.dailyRecords.map((rec, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-lg flex flex-col items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: wakeColor(rec.wakeTime) }}
                    >
                      <span className="text-[10px] opacity-80">{formatShortDate(rec.date)}</span>
                      <span>{rec.wakeTime}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-end gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(210,80%,40%)" }} />
                    빠른 기상
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(210,80%,75%)" }} />
                    늦은 기상
                  </span>
                </div>
              </div>
            )}

            {/* ===== 페이지 나눔 지점 ===== */}
            {hasDaily && <div className="page-break-point" />}

            {/* ===== 2페이지 미니 헤더 (인쇄 시에만 보임) ===== */}
            {hasDaily && (
              <div className="page2-header">
                <MiniHeader />
              </div>
            )}

            {/* ===== 공부 시간 막대 차트 ===== */}
            {hasDaily && (
              <div className="report-section bg-gray-50 rounded-xl p-5">
                <h3 className="text-sm font-bold text-gray-700 mb-4">일별 공부 시간</h3>
                <div className="flex items-end gap-[3px]" style={{ height: "200px" }}>
                  {data.dailyRecords.map((rec, i) => {
                    const mins = studyMins[i];
                    const pct = (mins / maxStudy) * 100;
                    const isAboveAvg = mins >= data.avgStudyMinutes;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                        <span className="text-[8px] text-gray-500 mb-1 leading-none whitespace-nowrap">
                          {minutesToHM(mins)}
                        </span>
                        <div
                          className="w-full rounded-t-sm min-h-[2px]"
                          style={{
                            height: `${pct}%`,
                            backgroundColor: isAboveAvg ? "#3B82F6" : "#BAE6FD",
                          }}
                        />
                        <span className="text-[7px] text-gray-400 mt-1 leading-none">
                          {formatShortDate(rec.date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 flex items-center justify-end gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded" style={{ backgroundColor: "#3B82F6" }} />
                    평균 이상
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded" style={{ backgroundColor: "#BAE6FD" }} />
                    평균 이하
                  </span>
                </div>
              </div>
            )}

            {/* ===== 학생 자기 피드백 ===== */}
            {data.studentFeedback && (
              <div className="report-section bg-sky-50 rounded-xl p-5 border border-sky-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">&#x1F4AC;</span>
                  <h3 className="text-sm font-bold text-sky-700">학생 자기 피드백</h3>
                </div>
                <EditableText text={data.studentFeedback} className="text-sm text-gray-700 leading-relaxed" />
              </div>
            )}

            {/* ===== 월간 멘토 총평 ===== */}
            {data.mentorSummary && (
              <div className="report-section bg-violet-50 rounded-xl p-5 border border-violet-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">&#x1F4DD;</span>
                  <h3 className="text-sm font-bold text-violet-700">월간 멘토 총평</h3>
                </div>
                <EditableText text={data.mentorSummary} className="text-sm text-gray-700 leading-relaxed" />
              </div>
            )}

            {/* ===== 다음 달 코칭 방향 ===== */}
            {data.directions.length > 0 && (
              <div className="report-section bg-blue-50 rounded-xl p-5 border border-blue-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">&#x1F3AF;</span>
                  <h3 className="text-sm font-bold text-blue-700">다음 달 코칭 방향</h3>
                </div>
                <ul className="space-y-2">
                  {data.directions.map((dir, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-400 text-xs mt-1">●</span>
                      <EditableText text={dir} tag="span" className="text-sm text-gray-700 leading-relaxed" />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ===== 학부모 메시지 ===== */}
            {data.parentMessage && (
              <div className="report-section bg-amber-50 rounded-xl p-5 border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">&#x1F49B;</span>
                  <h3 className="text-sm font-bold text-amber-700">학부모님께</h3>
                </div>
                <EditableText text={data.parentMessage} className="text-sm text-gray-700 leading-relaxed italic" />
              </div>
            )}
          </div>

          {/* ===== 푸터 ===== */}
          <div className="report-section px-8 py-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #F0F9FF 0%, #EDE9FE 100%)" }}>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" width={20} height={20}>
                <defs><linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#7DD3FC" /><stop offset="100%" stopColor="#3B82F6" /></linearGradient></defs>
                <polygon points="50,5 72,22 64,22 50,13 36,22 28,22" fill="url(#footerGrad)" />
                <polygon points="28,22 36,22 36,46 28,40" fill="url(#footerGrad)" />
                <polygon points="36,38 50,38 50,46 36,46" fill="url(#footerGrad)" />
                <polygon points="50,54 64,54 64,62 50,62" fill="url(#footerGrad)" />
                <polygon points="72,60 64,60 64,78 72,78" fill="url(#footerGrad)" />
                <polygon points="50,95 28,78 36,78 50,87 64,78 72,78" fill="url(#footerGrad)" />
              </svg>
              <span className="text-xs font-semibold text-gray-500">SKY MATE</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">작성일: {formattedDate}</p>
              <p className="text-xs text-gray-400">담당 멘토: {data.mentorName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
