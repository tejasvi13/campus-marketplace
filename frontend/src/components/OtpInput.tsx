import { useRef } from "react";
import type { ChangeEvent, ClipboardEvent, KeyboardEvent } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export default function OtpInput({ value, onChange, length = 6 }: OtpInputProps) {
  const boxes = useRef<(HTMLInputElement | null)[]>([]);

  const digits: string[] = value.padEnd(length, " ").slice(0, length).split("");

  function setDigit(index: number, digit: string): void {
    const next: string[] = digits.slice();
    next[index] = digit;
    onChange(next.join("").replace(/\s+$/, ""));
  }

  function handleChange(index: number, event: ChangeEvent<HTMLInputElement>): void {
    const typed: string = event.target.value.replace(/\D/g, "");
    if (!typed) return;

    // Typing a single digit moves you along.
    setDigit(index, typed[typed.length - 1]);
    if (index < length - 1) {
      boxes.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: KeyboardEvent<HTMLInputElement>): void {
    if (event.key === "Backspace") {
      event.preventDefault();
      if (digits[index].trim()) {
        setDigit(index, " ");
      } else if (index > 0) {
        setDigit(index - 1, " ");
        boxes.current[index - 1]?.focus();
      }
    }

    if (event.key === "ArrowLeft" && index > 0) {
      boxes.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < length - 1) {
      boxes.current[index + 1]?.focus();
    }
  }

  function handlePaste(event: ClipboardEvent<HTMLDivElement>): void {
    event.preventDefault();
    const pasted: string = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    boxes.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <div className="otp" onPaste={handlePaste}>
      {digits.map((digit: string, index: number) => (
        <input
          key={index}
          ref={(element: HTMLInputElement | null) => {
            boxes.current[index] = element;
          }}
          className="otp__box"
          inputMode="numeric"
          maxLength={1}
          value={digit.trim()}
          onChange={(event) => handleChange(index, event)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          aria-label={"Digit " + (index + 1)}
        />
      ))}
    </div>
  );
}
