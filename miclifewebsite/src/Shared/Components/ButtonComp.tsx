'use client';

import { useTranslation } from "react-i18next";

interface ButtonCompProps {
  text?: string;
  primaryColor?: string;
  secondaryColor?: string;
  [key: string]: any;
}

const ButtonComp = ({ 
  text = "Click Me", 
  primaryColor = "#075DA0", 
  secondaryColor = "#FE5A00", 
  ...props 
}: ButtonCompProps) => {
  const { t } = useTranslation();
  
  return (
    <button 
      className="px-5 py-3 w-full transition-all duration-300 dynamicBtn-hover text-black color" 
        style={{ "--primary-color": "primaryColor", "--secondary-color": secondaryColor } as React.CSSProperties}
      {...props}
    >
      {t(text)}
    </button>
  );
};

export default ButtonComp;
