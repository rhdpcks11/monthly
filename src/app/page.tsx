"use client";

import { useState } from "react";
import InputPanel from "@/components/InputPanel";
import ReportPreview from "@/components/ReportPreview";
import { ReportInput, ReportData, GeneratedContent } from "@/types";

const now = new Date();

const defaultInput: ReportInput = {
  studentName: "",
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  coachingMonth: 1,
  mentorName: "",
  taskCompletionRate: 0,
  taskCompletionDelta: 0,
  totalStudyHours: 0,
  dailyAvgHours: 0,
  wakeUpDays: 0,
  totalDays: 30,
  weeklyRates: [0, 0, 0, 0],
  studentFeedback: "",
  mentorSummary: "",
  directions: "",
  parentMessage: "",
  rawText: "",
};

export default function Home() {
  const [input, setInput] = useState<ReportInput>(defaultInput);
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePreview = () => {
    const directions = input.directions
      .split("\n")
      .map((d) => d.trim())
      .filter(Boolean);

    setReport({
      studentName: input.studentName,
      year: input.year,
      month: input.month,
      coachingMonth: input.coachingMonth,
      mentorName: input.mentorName,
      taskCompletionRate: input.taskCompletionRate,
      taskCompletionDelta: input.taskCompletionDelta,
      totalStudyHours: input.totalStudyHours,
      dailyAvgHours: input.dailyAvgHours,
      wakeUpDays: input.wakeUpDays,
      totalDays: input.totalDays,
      weeklyRates: input.weeklyRates,
      studentFeedback: input.studentFeedback,
      mentorSummary: input.mentorSummary,
      directions,
      parentMessage: input.parentMessage,
    });
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "AI 생성에 실패했습니다.");
      }
      const generated: GeneratedContent = await res.json();
      setInput((prev) => ({
        ...prev,
        studentFeedback: generated.student_feedback,
        mentorSummary: generated.mentor_summary,
        directions: generated.directions.join("\n"),
        parentMessage: generated.parent_message,
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-[420px] min-w-[420px] flex-shrink-0 relative">
        <InputPanel
          data={input}
          onChange={setInput}
          onGenerate={handleGenerate}
          onPreview={handlePreview}
          loading={loading}
        />
        {error && (
          <div className="absolute bottom-4 left-5 right-5 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-600">
            {error}
          </div>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <ReportPreview data={report} />
      </div>
    </div>
  );
}
