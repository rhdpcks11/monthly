"use client";

import { useRef, KeyboardEvent, ChangeEvent } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function TimeInput({ value, onChange, placeholder = "00:00", className = "" }: Props) {
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);

  // "06:35" → ["06", "35"]
  const parts = value ? value.split(":") : ["", ""];
  const hh = parts[0] || "";
  const mm = parts[1] || "";

  const buildValue = (h: string, m: string) => {
    if (!h && !m) return "";
    return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
  };

  const handleHourChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    onChange(buildValue(raw, mm));
    // 2자리 입력 시 자동으로 분 칸으로 이동
    if (raw.length === 2) {
      ref2.current?.focus();
      ref2.current?.select();
    }
  };

  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    onChange(buildValue(hh, raw));
  };

  const handleHourKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ":" || e.key === "ArrowRight") {
      e.preventDefault();
      ref2.current?.focus();
      ref2.current?.select();
    }
  };

  const handleMinKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && mm === "") {
      e.preventDefault();
      ref1.current?.focus();
      ref1.current?.select();
    }
    // Tab/Enter로 다음 행으로 이동 (기본 동작)
  };

  const phParts = placeholder.split(":");

  return (
    <div className={`inline-flex items-center border border-gray-200 rounded bg-white overflow-hidden ${className}`}>
      <input
        ref={ref1}
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={hh}
        onChange={handleHourChange}
        onKeyDown={handleHourKey}
        onFocus={(e) => e.target.select()}
        placeholder={phParts[0] || "00"}
        className="w-6 text-center text-xs py-1 outline-none bg-transparent"
      />
      <span className="text-xs text-gray-400 select-none">:</span>
      <input
        ref={ref2}
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={mm}
        onChange={handleMinChange}
        onKeyDown={handleMinKey}
        onFocus={(e) => e.target.select()}
        placeholder={phParts[1] || "00"}
        className="w-6 text-center text-xs py-1 outline-none bg-transparent"
      />
    </div>
  );
}
