"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export function SelectPrimitive({
  "aria-label": ariaLabel,
  className = "",
  disabled = false,
  name,
  onChange,
  options,
  theme = "light",
  value
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const selectId = useId();
  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value)
  );
  const selectedOption = options[selectedIndex] || options[0];
  const safeTheme = theme === "dark" ? "dark" : "light";

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(selectedIndex);
    }
  }, [isOpen, selectedIndex]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event) {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen]);

  function chooseOption(option) {
    if (option.value !== value) {
      onChange?.(option.value);
    }
    setIsOpen(false);
    buttonRef.current?.focus();
  }

  function moveActive(step) {
    setIsOpen(true);
    setActiveIndex((current) => (current + step + options.length) % options.length);
  }

  function handleKeyDown(event) {
    if (disabled) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      moveActive(1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(-1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) {
        chooseOption(options[activeIndex]);
      } else {
        setIsOpen(true);
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  }

  return (
    <div
      className={`ui-select ${className}`.trim()}
      data-select-theme={safeTheme}
      data-open={isOpen ? "true" : "false"}
      ref={rootRef}
    >
      {name ? <input name={name} type="hidden" value={value} /> : null}
      <button
        ref={buttonRef}
        type="button"
        className="ui-select-trigger"
        aria-activedescendant={isOpen ? `${selectId}-option-${activeIndex}` : undefined}
        aria-controls={`${selectId}-listbox`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => setIsOpen((current) => !current)}
        onKeyDown={handleKeyDown}
      >
        <span className="ui-select-value">{selectedOption?.label}</span>
        <ChevronDown className="ui-select-icon" size={18} strokeWidth={1.5} aria-hidden="true" />
      </button>

      {isOpen ? (
        <div className="ui-select-menu" id={`${selectId}-listbox`} role="listbox" aria-label={ariaLabel}>
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <button
                type="button"
                className="ui-select-option"
                data-active={isActive ? "true" : "false"}
                data-selected={isSelected ? "true" : "false"}
                id={`${selectId}-option-${index}`}
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => chooseOption(option)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
