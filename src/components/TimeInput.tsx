"use client";

import { useRef, useState, useEffect, KeyboardEvent, ChangeEvent } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function TimeInput({ value, onChange, placeholder = "00:00", className = "" }: Props) {
  const ref1 = useRef<HTMLInputElement>(null);
  const ref2 = useRef<HTMLInputElement>(null);

  // 내부에서 raw 값 관리 (패딩 없이)
  const [rawHH, setRawHH] = useState("");
  const [rawMM, setRawMM] = useState("");

  // 외부 value가 바뀌면 동기화
  useEffect(() => {
    if (value) {
      const parts = value.split(":");
      setRawHH(parts[0] || "");
      setRawMM(parts[1] || "");
    } else {
      setRawHH("");
      setRawMM("");
    }
  }, [value]);

  const emitChange = (h: string, m: string) => {
    if (!h && !m) {
      onChange("");
    } else {
      const hPad = h ? h.padStart(2, "0") : "00";
      const mPad = m ? m.padStart(2, "0") : "00";
      onChange(`${hPad}:${mPad}`);
    }
  };

  const handleHourChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    setRawHH(raw);
    // 2자리 완성 시 분 칸으로 이동
    if (raw.length === 2) {
      emitChange(raw, rawMM);
      ref2.current?.focus();
      ref2.current?.select();
    }
  };

  const handleHourBlur = () => {
    // 포커스 떠날 때 패딩 적용
    if (rawHH) {
      const padded = rawHH.padStart(2, "0");
      setRawHH(padded);
      emitChange(padded, rawMM);
    }
  };

  const handleMinChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    setRawMM(raw);
    if (raw.length === 2) {
      emitChange(rawHH, raw);
    }
  };

  const handleMinBlur = () => {
    if (rawMM) {
      const padded = rawMM.padStart(2, "0");
      setRawMM(padded);
      emitChange(rawHH, padded);
    }
  };

  const handleHourKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === ":" || e.key === "ArrowRight") {
      e.preventDefault();
      handleHourBlur();
      ref2.current?.focus();
      ref2.current?.select();
    }
  };

  const handleMinKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && rawMM === "") {
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
        value={rawHH}
        onChange={handleHourChange}
        onBlur={handleHourBlur}
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
        value={rawMM}
        onChange={handleMinChange}
        onBlur={handleMinBlur}
        onKeyDown={handleMinKey}
        onFocus={(e) => e.target.select()}
        placeholder={phParts[1] || "00"}
        className="w-6 text-center text-xs py-1 outline-none bg-transparent"
      />
    </div>
  );
}
