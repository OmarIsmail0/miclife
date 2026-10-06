'use client';

interface TextareaCompProps {
  primaryColor?: string;
  secondaryColor?: string;
  rows?: number;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  [key: string]: any;
}

const TextareaComp = ({ 
  primaryColor, 
  secondaryColor, 
  rows = 4, 
  ...props 
}: TextareaCompProps) => {
  const colorscm = {
    primary: "#075DA0",
    secondary: "#FE5A00",
  };

  return (
    <textarea
      style={{
        "--border-color": primaryColor || colorscm.primary,
        "--focus-border-color": secondaryColor || colorscm.secondary,
        borderBottomColor: "var(--border-color)",
      } as React.CSSProperties}
      onFocus={(e) => (e.target.style.borderBottomColor = "var(--focus-border-color)")}
      onBlur={(e) => (e.target.style.borderBottomColor = "var(--border-color)")}
      className="w-full p-3 border-b focus:outline-none transition-all duration-300"
      rows={rows}
      {...props}
    />
  );
};

export default TextareaComp;
