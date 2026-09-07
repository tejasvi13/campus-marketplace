import { useRef } from "react";

export default function OtpInput({ value, onChange, length = 6 }) {
  const boxes = useRef([]);

  const digits = value.padEnd(length, " ").slice(0, length).split("");

  function setDigit(index, digit) {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join("").replace(/\s+$/, ""));
  }

  function handleChange(index, event) {
    const typed = event.target.value.replace(/\D/g, "");
    if (!typed) return;

    // Typing a single digit moves you along.
    setDigit(index, typed[typed.length - 1]);
    if (index < length - 1) {
      boxes.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, event) {
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

  function handlePaste(event) {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    boxes.current[Math.min(pasted.length, length - 1)]?.focus();
  }

  return (
    <div className="otp" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => (boxes.current[index] = element)}
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
