"use client";

import { ReportInput } from "@/types";

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

  const inputClass =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white";
  const labelClass = "block text-xs font-semibold text-gray-600 mb-1";
  const textareaClass =
    "w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent bg-white resize-y";

  const canPreview = data.studentName.trim() && data.mentorName.trim();

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
        <h2 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-200">
          기본 정보
        </h2>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>학생 이름</label>
            <input
              className={inputClass}
              value={data.studentName}
              onChange={(e) => update("studentName", e.target.value)}
              placeholder="홍길동"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>연도</label>
              <input
                type="number"
                className={inputClass}
                value={data.year}
                onChange={(e) => update("year", Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>월</label>
              <input
                type="number"
                className={inputClass}
                min={1}
                max={12}
                value={data.month}
                onChange={(e) => update("month", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>코칭 개월차</label>
              <input
                type="number"
                className={inputClass}
                min={1}
                value={data.coachingMonth}
                onChange={(e) => update("coachingMonth", Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>담당 멘토</label>
              <input
                className={inputClass}
                value={data.mentorName}
                onChange={(e) => update("mentorName", e.target.value)}
                placeholder="김멘토"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 이달의 수치 */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-200">
          이달의 수치
        </h2>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>과제 완료율 (%)</label>
              <input
                type="number"
                className={inputClass}
                min={0}
                max={100}
                value={data.taskCompletionRate}
                onChange={(e) => update("taskCompletionRate", Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>지난달 대비 (%p)</label>
              <input
                type="number"
                className={inputClass}
                value={data.taskCompletionDelta}
                onChange={(e) => update("taskCompletionDelta", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>총 학습시간 (h)</label>
              <input
                type="number"
                className={inputClass}
                min={0}
                step={0.1}
                value={data.totalStudyHours}
                onChange={(e) => update("totalStudyHours", Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>일 평균 (h)</label>
              <input
                type="number"
                className={inputClass}
                min={0}
                step={0.1}
                value={data.dailyAvgHours}
                onChange={(e) => update("dailyAvgHours", Number(e.target.value))}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>기상 인증 (일)</label>
              <input
                type="number"
                className={inputClass}
                min={0}
                value={data.wakeUpDays}
                onChange={(e) => update("wakeUpDays", Number(e.target.value))}
              />
            </div>
            <div>
              <label className={labelClass}>총 일수</label>
              <input
                type="number"
                className={inputClass}
                min={1}
                value={data.totalDays}
                onChange={(e) => update("totalDays", Number(e.target.value))}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 주차별 과제 완료율 */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-200">
          주차별 과제 완료율
        </h2>
        <div className="space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <label className="text-xs font-semibold text-gray-600 w-12">
                {i + 1}주차
              </label>
              <input
                type="number"
                className={inputClass}
                min={0}
                max={100}
                value={data.weeklyRates[i]}
                onChange={(e) => updateWeekly(i, Number(e.target.value))}
              />
              <span className="text-xs text-gray-400">%</span>
            </div>
          ))}
        </div>
      </section>

      {/* 레포트 내용 직접 입력 */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-200">
          레포트 내용
        </h2>
        <div className="space-y-3">
          <div>
            <label className={labelClass}>학생 자기 피드백</label>
            <textarea
              className={textareaClass}
              rows={3}
              value={data.studentFeedback}
              onChange={(e) => update("studentFeedback", e.target.value)}
              placeholder="학생 본인의 목소리로 이번 달 소감을 작성해주세요."
            />
          </div>
          <div>
            <label className={labelClass}>멘토 피드백</label>
            <textarea
              className={textareaClass}
              rows={3}
              value={data.mentorFeedback}
              onChange={(e) => update("mentorFeedback", e.target.value)}
              placeholder="멘토의 관찰자 시점에서 학생 성장과 노력을 작성해주세요."
            />
          </div>
          <div>
            <label className={labelClass}>월간 총평 (첫째 문단)</label>
            <textarea
              className={textareaClass}
              rows={3}
              value={data.summaryP1}
              onChange={(e) => update("summaryP1", e.target.value)}
              placeholder="이번 달 전반적 성과와 태도 평가"
            />
          </div>
          <div>
            <label className={labelClass}>월간 총평 (둘째 문단)</label>
            <textarea
              className={textareaClass}
              rows={3}
              value={data.summaryP2}
              onChange={(e) => update("summaryP2", e.target.value)}
              placeholder="앞으로의 기대와 응원 메시지"
            />
          </div>
          <div>
            <label className={labelClass}>다음 달 코칭 방향 (줄바꿈으로 구분)</label>
            <textarea
              className={textareaClass}
              rows={3}
              value={data.directions}
              onChange={(e) => update("directions", e.target.value)}
              placeholder={"영어 독해 집중 훈련\n오답노트 습관화\n주 3회 자습 시간 확보"}
            />
          </div>
          <div>
            <label className={labelClass}>학부모 메시지</label>
            <textarea
              className={textareaClass}
              rows={2}
              value={data.parentMessage}
              onChange={(e) => update("parentMessage", e.target.value)}
              placeholder="학부모님께 전하는 따뜻한 메시지"
            />
          </div>
        </div>
      </section>

      {/* AI 자동생성 (선택) */}
      <section className="mb-5">
        <h2 className="text-sm font-bold text-gray-700 mb-3 pb-1 border-b border-gray-200">
          AI 자동생성 (선택)
        </h2>
        <p className="text-xs text-gray-400 mb-2">
          원문 텍스트를 붙여넣고 버튼을 누르면 위 레포트 내용이 자동으로 채워집니다.
        </p>
        <textarea
          className={textareaClass}
          rows={6}
          value={data.rawText}
          onChange={(e) => update("rawText", e.target.value)}
          placeholder="학생 피드백, 멘토 메모, 코칭 방향 등을 자유롭게 붙여넣으세요..."
        />
        <button
          onClick={onGenerate}
          disabled={loading || !data.rawText.trim()}
          className="w-full mt-2 py-2 rounded-lg text-white font-semibold text-xs transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-gray-600 hover:bg-gray-700 active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              AI 생성 중...
            </span>
          ) : (
            "AI로 내용 자동 채우기"
          )}
        </button>
      </section>

      {/* 미리보기 버튼 */}
      <button
        onClick={onPreview}
        disabled={!canPreview}
        className="w-full py-3 rounded-xl text-white font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 shadow-md hover:shadow-lg active:scale-[0.98] mb-4"
      >
        레포트 미리보기
      </button>
    </div>
  );
}
