"use client";

import { ReportInput } from "@/types";
import { addDays, formatDate } from "@/lib/parseDaily";
import TimeInput from "./TimeInput";

interface Props {
  data: ReportInput;
  onChange: (data: ReportInput) => void;
  onGenerate: () => void;
  onPreview: () => void;
  loading: boolean;
}

export default function InputPanel({ data, onChange, onGenerate, onPreview, loading }: Props) {
  const update = <K extends keyof ReportInput>(key: K, value: ReportInput[K]) => {
    onChange({ ...data, [key]: value });
  };

  const updateWeekly = (index: number, value: number) => {
    const newRates = [...data.weeklyRates] as [number, number, number, number];
    newRates[index] = value;
    onChange({ ...data, weeklyRates: newRates });
  };

  const updateDailyEntry = (index: number, field: "wakeTime" | "studyTime", value: string) => {
    const newEntries = [...data.dailyEntries];
    newEntries[index] = { ...newEntries[index], [field]: value };
    onChange({ ...data, dailyEntries: newEntries });
  };

  const inputClass =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

  const canPreview = data.studentName.trim() && data.mentorName.trim();

  // 날짜 라벨 계산
  const getDateLabel = (dayIndex: number) => {
    if (!data.startDate) return `${dayIndex + 1}일차`;
    const d = addDays(data.startDate, dayIndex);
    return formatDate(d);
  };

  return (
    <div className="h-screen overflow-y-auto p-5 bg-gray-50 border-r border-gray-200">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <svg viewBox="0 0 100 100" width={28} height={28}>
            <defs>
              <linearGradient id="logoGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#7DD3FC" />
                <stop offset="100%" stopColor="#3B82F6" />
              </linearGradient>
            </defs>
            <polygon points="50,5 72,22 64,22 50,13 36,22 28,22" fill="url(#logoGradSmall)" />
            <polygon points="28,22 36,22 36,46 28,40" fill="url(#logoGradSmall)" />
            <polygon points="36,38 50,38 50,46 36,46" fill="url(#logoGradSmall)" />
            <polygon points="50,54 64,54 64,62 50,62" fill="url(#logoGradSmall)" />
            <polygon points="72,60 64,60 64,78 72,78" fill="url(#logoGradSmall)" />
            <polygon points="50,95 28,78 36,78 50,87 64,78 72,78" fill="url(#logoGradSmall)" />
          </svg>
          <h1 className="text-lg font-bold text-gray-800">SKY MATE</h1>
        </div>
        <p className="text-xs text-gray-500">월간 학습코칭 레포트 생성기</p>
      </div>

      {/* 기본 정보 */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-200">기본 정보</h2>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>학생 이름</label>
            <input className={inputClass} value={data.studentName} onChange={(e) => update("studentName", e.target.value)} placeholder="홍길동" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>연도</label>
              <input type="number" className={inputClass} value={data.year} onChange={(e) => update("year", Number(e.target.value))} />
            </div>
            <div>
              <label className={labelClass}>월</label>
              <input type="number" className={inputClass} min={1} max={12} value={data.month} onChange={(e) => update("month", Number(e.target.value))} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>코칭 개월차</label>
              <input type="number" className={inputClass} min={1} value={data.coachingMonth} onChange={(e) => update("coachingMonth", Number(e.target.value))} />
            </div>
            <div>
              <label className={labelClass}>담당 멘토</label>
              <input className={inputClass} value={data.mentorName} onChange={(e) => update("mentorName", e.target.value)} placeholder="김멘토" />
            </div>
          </div>
        </div>
      </section>

      {/* 코칭 시작일 + 일별 데이터 */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-200">일별 데이터 (28일)</h2>
        <div className="mb-3">
          <label className={labelClass}>코칭 시작일</label>
          <input
            type="date"
            className={inputClass}
            value={data.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />
          {data.startDate && (
            <p className="text-xs text-sky-500 mt-1">
              기간: {formatDate(addDays(data.startDate, 0))} ~ {formatDate(addDays(data.startDate, 27))}
            </p>
          )}
        </div>

        {/* 일별 입력 테이블 */}
        <div className="rounded-lg border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-[1fr_1fr_1fr] bg-gray-100 text-xs font-semibold text-gray-500 py-2 px-2">
            <span>날짜</span>
            <span className="text-center">기상시간</span>
            <span className="text-center">공부시간</span>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {data.dailyEntries.map((entry, i) => (
              <div
                key={i}
                className={`grid grid-cols-[1fr_1fr_1fr] items-center py-1.5 px-2 ${
                  i % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                <span className="text-xs text-gray-500 font-medium">
                  {data.startDate ? (
                    <>
                      <span className="text-gray-400 mr-1">{i + 1}.</span>
                      {getDateLabel(i).slice(5)}
                    </>
                  ) : (
                    `${i + 1}일차`
                  )}
                </span>
                <TimeInput
                  value={entry.wakeTime}
                  onChange={(v) => updateDailyEntry(i, "wakeTime", v)}
                  placeholder="06:30"
                  className="justify-center focus-within:ring-1 focus-within:ring-sky-300"
                />
                <TimeInput
                  value={entry.studyTime}
                  onChange={(v) => updateDailyEntry(i, "studyTime", v)}
                  placeholder="10:30"
                  className="justify-center focus-within:ring-1 focus-within:ring-sky-300"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 이달의 수치 */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-200">이달의 수치</h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>과제 완료율 (%)</label>
              <input type="number" className={inputClass} min={0} max={100} value={data.taskCompletionRate} onChange={(e) => update("taskCompletionRate", Number(e.target.value))} />
            </div>
            <div>
              <label className={labelClass}>지난달 대비 (%p)</label>
              <input type="number" className={inputClass} value={data.taskCompletionDelta} onChange={(e) => update("taskCompletionDelta", Number(e.target.value))} />
            </div>
          </div>
        </div>
      </section>

      {/* 주차별 과제 완료율 */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-200">주차별 과제 완료율</h2>
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <label className="text-xs font-semibold text-gray-600 w-12">{i + 1}주차</label>
              <input type="number" className={inputClass} min={0} max={100} value={data.weeklyRates[i]} onChange={(e) => updateWeekly(i, Number(e.target.value))} />
              <span className="text-xs text-gray-400">%</span>
            </div>
          ))}
        </div>
      </section>

      {/* AI 자동생성 */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-200">AI 자동생성 (선택)</h2>
        <p className="text-xs text-gray-400 mb-2">원문 텍스트를 붙여넣으면 아래 4개 항목이 자동 채워집니다.</p>
        <textarea
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white resize-y"
          rows={6}
          value={data.rawText}
          onChange={(e) => update("rawText", e.target.value)}
          placeholder="학생 피드백, 멘토 메모, 코칭 방향 등을 자유롭게 붙여넣으세요..."
        />
        <button
          onClick={onGenerate}
          disabled={loading || !data.rawText.trim()}
          className="w-full mt-2 py-2.5 rounded-lg text-white font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-gray-700 hover:bg-gray-800 active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AI 생성 중...
            </span>
          ) : "AI로 내용 자동 채우기"}
        </button>
      </section>

      {/* 레포트 내용 */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-200">레포트 내용</h2>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>학생 자기 피드백</label>
            <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white resize-y" rows={3} value={data.studentFeedback} onChange={(e) => update("studentFeedback", e.target.value)} placeholder="학생 본인의 목소리로 이번 달 소감" />
          </div>
          <div>
            <label className={labelClass}>월간 멘토 총평</label>
            <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white resize-y" rows={4} value={data.mentorSummary} onChange={(e) => update("mentorSummary", e.target.value)} placeholder="멘토의 관찰 및 전반적 평가" />
          </div>
          <div>
            <label className={labelClass}>다음 달 코칭 방향 (줄바꿈 구분)</label>
            <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white resize-y" rows={3} value={data.directions} onChange={(e) => update("directions", e.target.value)} placeholder={"영어 독해 집중\n오답노트 습관화"} />
          </div>
          <div>
            <label className={labelClass}>학부모 메시지</label>
            <textarea className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 bg-white resize-y" rows={2} value={data.parentMessage} onChange={(e) => update("parentMessage", e.target.value)} placeholder="학부모님께 전하는 따뜻한 메시지" />
          </div>
        </div>
      </section>

      <button
        onClick={onPreview}
        disabled={!canPreview}
        className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 shadow-md hover:shadow-lg active:scale-[0.98] mb-4"
      >
        레포트 미리보기
      </button>
    </div>
  );
}
