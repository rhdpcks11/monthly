"use client";

import { ReportData } from "@/types";
import { useRef, useCallback, useState } from "react";

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

export default function ReportPreview({ data }: Props) {
  const reportRef = useRef<HTMLDivElement>(null);
  const [saving, setSaving] = useState(false);

  const handlePDF = useCallback(async () => {
    if (!reportRef.current || !data) return;
    setSaving(true);

    try {
      const el = reportRef.current;

      // 편집 힌트 숨기기
      el.classList.add("printing");

      // dynamic import
      const html2canvasModule = await import("html2canvas");
      const html2canvas = html2canvasModule.default;
      const jspdfModule = await import("jspdf");
      const jsPDF = jspdfModule.jsPDF;

      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        logging: false,
        allowTaint: true,
        foreignObjectRendering: false,
      });

      el.classList.remove("printing");

      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210; // A4 mm
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      const pdf = new jsPDF("p", "mm", "a4");

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      } else {
        // 멀티페이지
        let y = 0;
        const pageCanvasH = (pageHeight * canvas.width) / imgWidth;
        let isFirst = true;

        while (y < canvas.height) {
          const sliceH = Math.min(pageCanvasH, canvas.height - y);
          const pageCanvas = document.createElement("canvas");
          pageCanvas.width = canvas.width;
          pageCanvas.height = sliceH;
          const ctx = pageCanvas.getContext("2d");
          if (!ctx) break;
          ctx.drawImage(canvas, 0, y, canvas.width, sliceH, 0, 0, canvas.width, sliceH);

          const pageImgH = (sliceH * imgWidth) / canvas.width;
          if (!isFirst) pdf.addPage();
          pdf.addImage(pageCanvas.toDataURL("image/png"), "PNG", 0, 0, imgWidth, pageImgH);

          y += pageCanvasH;
          isFirst = false;
        }
      }

      const mm = String(data.month).padStart(2, "0");
      pdf.save(`스카이메이트_${data.studentName}_${data.year}년${mm}월.pdf`);
    } catch (err) {
      console.error("PDF 생성 오류:", err);
      alert("PDF 생성 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    } finally {
      setSaving(false);
    }
  }, [data]);

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

  return (
    <div className="h-screen overflow-y-auto bg-gray-100">
      {/* PDF 버튼 */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-3 flex justify-end print-hide">
        <button
          onClick={handlePDF}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg text-sm font-semibold hover:from-sky-500 hover:to-blue-600 shadow-md hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              저장 중...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              PDF 저장
            </>
          )}
        </button>
      </div>

      {/* 레포트 영역 */}
      <div className="p-6">
        <div
          ref={reportRef}
          id="report-content"
          className="max-w-[800px] mx-auto bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {/* 헤더 */}
          <div
            className="px-8 py-8"
            style={{ background: "linear-gradient(135deg, #BAE6FD 0%, #C4B5FD 50%, #DDD6FE 100%)" }}
          >
            <div className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 100 100" width={40} height={40}>
                <defs>
                  <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="100%" stopColor="#E0E7FF" />
                  </linearGradient>
                </defs>
                <polygon points="50,5 72,22 64,22 50,13 36,22 28,22" fill="url(#headerGrad)" />
                <polygon points="28,22 36,22 36,46 28,40" fill="url(#headerGrad)" />
                <polygon points="36,38 50,38 50,46 36,46" fill="url(#headerGrad)" />
                <polygon points="50,54 64,54 64,62 50,62" fill="url(#headerGrad)" />
                <polygon points="72,60 64,60 64,78 72,78" fill="url(#headerGrad)" />
                <polygon points="50,95 28,78 36,78 50,87 64,78 72,78" fill="url(#headerGrad)" />
              </svg>
              <div>
                <h1 className="text-white text-xl font-bold tracking-wide" style={{ fontFamily: "sans-serif" }}>SKY MATE</h1>
                <p className="text-white/80 text-xs">월간 학습코칭 레포트</p>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/70 text-xs mb-1">코칭 {data.coachingMonth}개월차</p>
                <h2 className="text-white text-2xl font-bold">{data.studentName} 학생</h2>
              </div>
              <div className="text-right">
                <p className="text-white text-lg font-bold">{data.year}년 {data.month}월</p>
              </div>
            </div>
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* 수치 카드 3개 */}
            <div className="grid grid-cols-3 gap-4">
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

            {/* 주차별 완료율 바 차트 */}
            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="text-sm font-bold text-gray-700 mb-4">주차별 과제 완료율</h3>
              <div className="space-y-3">
                {data.weeklyRates.map((rate, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-500 w-10">{i + 1}주차</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-5 overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${rate}%`, background: "linear-gradient(90deg, #7DD3FC, #818CF8)" }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-600 w-10 text-right">{rate}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 학생 자기 피드백 */}
            {data.studentFeedback && (
              <div className="bg-sky-50 rounded-xl p-5 border border-sky-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">&#x1F4AC;</span>
                  <h3 className="text-sm font-bold text-sky-700">학생 자기 피드백</h3>
                </div>
                <EditableText text={data.studentFeedback} className="text-sm text-gray-700 leading-relaxed" />
              </div>
            )}

            {/* 월간 멘토 총평 */}
            {data.mentorSummary && (
              <div className="bg-violet-50 rounded-xl p-5 border border-violet-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">&#x1F4DD;</span>
                  <h3 className="text-sm font-bold text-violet-700">월간 멘토 총평</h3>
                </div>
                <EditableText text={data.mentorSummary} className="text-sm text-gray-700 leading-relaxed" />
              </div>
            )}

            {/* 다음 달 코칭 방향 */}
            {data.directions.length > 0 && (
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
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

            {/* 학부모 메시지 */}
            {data.parentMessage && (
              <div className="bg-amber-50 rounded-xl p-5 border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg">&#x1F49B;</span>
                  <h3 className="text-sm font-bold text-amber-700">학부모님께</h3>
                </div>
                <EditableText text={data.parentMessage} className="text-sm text-gray-700 leading-relaxed italic" />
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="px-8 py-5 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #F0F9FF 0%, #EDE9FE 100%)" }}>
            <div className="flex items-center gap-2">
              <svg viewBox="0 0 100 100" width={20} height={20}>
                <defs>
                  <linearGradient id="footerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7DD3FC" />
                    <stop offset="100%" stopColor="#3B82F6" />
                  </linearGradient>
                </defs>
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
