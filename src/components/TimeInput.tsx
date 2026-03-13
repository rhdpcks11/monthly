"use client";

import { useRef, useState, KeyboardEvent, ChangeEvent } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function TimeInput({ value, onChange, placeholder = "00:00", className = "" }: Props) {
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [localHH, setLocalHH] = useState("");
  const [localMM, setLocalMM] = useState("");

  // 외부 value에서 표시값 계산 (포커스 안 잡혀있을 때만 외부 값 사용)
  const externalParts = value ? value.split(":") : ["", ""];
  const displayHH = focused ? localHH : externalParts[0] || "";
  const displayMM = focused ? localMM : externalParts[1] || "";

  const emitChange = (h: string, m: string) => {
    if (!h && !m) {
      onChange("");
    } else {
      onChange(`${(h || "").padStart(2, "0")}:${(m || "").padStart(2, "0")}`);
    }
  };

  const handleHourFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    setLocalHH(externalParts[0] || "");
    setLocalMM(externalParts[1] || "");
    e.target.select();
  };

  const handleMinFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    setLocalHH(externalParts[0] || "");
    setLocalMM(externalParts[1] || "");
    e.target.select();
  };

  const handleHourChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    setLocalHH(raw);
    if (raw.length === 2) {
      emitChange(raw, localMM);
      setTimeout(() => {
        ref2.current?.focus();
        ref2.current?.select();
      }, 0);
    }
  };

  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    setLocalMM(raw);
    if (raw.length === 2) {
      emitChange(localHH, raw);
    }
  };

  const handleHourBlur = () => {
    if (localHH) {
      emitChange(localHH, localMM);
    }
    // 분 칸으로 이동한 경우 focused 유지
    setTimeout(() => {
      if (document.activeElement !== ref2.current) {
        setFocused(false);
      }
    }, 0);
  };

  const handleMinBlur = () => {
    if (localMM) {
      emitChange(localHH, localMM);
    }
    setTimeout(() => {
      if (document.activeElement !== ref1.current) {
        setFocused(false);
      }
    }, 0);
  };

  const handleHourKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ":" || e.key === "ArrowRight") {
      e.preventDefault();
      ref2.current?.focus();
      ref2.current?.select();
    }
  };

  const handleMinKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && localMM === "") {
      e.preventDefault();
      ref1.current?.focus();
      ref1.current?.select();
    }
  };

  const phParts = placeholder.split(":");

  return (
    <div className={`inline-flex items-center border border-gray-200 rounded bg-white overflow-hidden ${className}`}>
      <input
        ref={ref1}
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={displayHH}
        onChange={handleHourChange}
        onFocus={handleHourFocus}
        onBlur={handleHourBlur}
        onKeyDown={handleHourKey}
        placeholder={phParts[0] || "00"}
        className="w-6 text-center text-xs py-1 outline-none bg-transparent"
      />
      <span className="text-xs text-gray-400 select-none">:</span>
      <input
        ref={ref2}
        type="text"
        inputMode="numeric"
        maxLength={2}
        value={displayMM}
        onChange={handleMinChange}
        onFocus={handleMinFocus}
        onBlur={handleMinBlur}
        onKeyDown={handleMinKey}
        placeholder={phParts[1] || "00"}
        className="w-6 text-center text-xs py-1 outline-none bg-transparent"
      />
    </div>
  );
}
