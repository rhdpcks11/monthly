import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rawText, studentName, taskCompletionRate, totalStudyHours, wakeUpDays, totalDays, coachingMonth, month } = body;

    const systemPrompt = `당신은 SKY MATE 학습코칭 서비스의 전문 리포트 작성자입니다.
따뜻하고 전문적인 어조로 작성하세요.
절대 "AI"라는 단어를 사용하지 마세요.
모든 내용은 한국어로 작성하세요.`;

    const userPrompt = `아래는 ${studentName} 학생의 ${month}월 코칭 ${coachingMonth}개월차 데이터입니다.

## 수치 데이터
- 과제 완료율: ${taskCompletionRate}%
- 총 학습시간: ${totalStudyHours}시간
- 기상 인증: ${wakeUpDays}일 / ${totalDays}일

## 코칭 원문 텍스트
${rawText}

위 내용을 분석하여 아래 JSON 형식으로 정확히 반환해주세요. JSON만 반환하고 다른 텍스트는 포함하지 마세요.

{
  "student_feedback": "학생 자기 피드백 (학생 본인의 목소리로, 1인칭, 3~5문장)",
  "mentor_feedback": "멘토 피드백 (관찰자 시점, 학생의 성장과 노력을 구체적으로 언급, 3~5문장)",
  "directions": ["다음 달 코칭 방향 1", "코칭 방향 2", "코칭 방향 3"],
  "parent_message": "학부모 메시지 (학부모님께 전하는 따뜻한 2~3문장)",
  "summary_p1": "월간 총평 첫 문단 (이번 달 전반적 성과와 태도 평가, 3~4문장)",
  "summary_p2": "월간 총평 둘째 문단 (앞으로의 기대와 응원 메시지, 3~4문장)"
}`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      messages: [
        { role: "user", content: userPrompt },
      ],
      system: systemPrompt,
    });

    const text = message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json({ error: "Failed to parse response" }, { status: 500 });
    }

    const parsed = JSON.parse(jsonMatch[0]);
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    console.error("API Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
