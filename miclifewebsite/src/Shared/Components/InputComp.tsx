'use client';

interface InputCompProps {
  bgColor?: string;
  borderColor?: string;
  focusColor?: string;
  direction?: "ltr" | "rtl";
  style?: React.CSSProperties;
  type?: string;
  borderRadius?: string;
  borderWidth?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  "aria-label"?: string;
  [key: string]: any;
}

const InputComp = ({
  bgColor,
  borderColor = "#075DA0",
  focusColor = "#FE5A00",
  direction,
  style,
  type = "text",
  borderRadius,
  borderWidth,
  placeholder,
  value,
  onChange,
  "aria-label": ariaLabel,
  ...props
}: InputCompProps) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "tel" || type === "number") {
      const pattern = /[0-9]/;
      if (!pattern.test(e.key)) {
        e.preventDefault();
      }
    }
  };

  return (
    <input
      {...props}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      aria-label={ariaLabel}
      className="w-full p-3 border-b focus:outline-none"
      style={{
        "--border-color": borderColor,
        "--focus-border-color": focusColor,
        borderBottomColor: "var(--border-color)",
        backgroundColor: bgColor,
        direction: direction,
        borderRadius: borderRadius,
        borderWidth: borderWidth,
        ...style,
      } as React.CSSProperties}
      onKeyPress={handleKeyPress}
      onFocus={(e) => (e.target.style.borderBottomColor = "var(--focus-border-color)")}
      onBlur={(e) => (e.target.style.borderBottomColor = "var(--border-color)")}
    />
  );
};

export default InputComp;
