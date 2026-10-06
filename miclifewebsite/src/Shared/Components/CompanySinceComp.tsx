'use client';
import { ReactNode } from "react";

interface CompanySinceCompProps {
  children?: ReactNode;
}

const CompanySinceComp = ({ children }: CompanySinceCompProps) => {
  return (
    <div className="text-center">
      <div
        style={{
          backgroundImage: `url(/assets/miclife/back.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
        className="flex items-center justify-center h-[12vh] md:h-[20vh] lg:h-[30vh] px-4 md:px-6 lg:px-8"
      >
        <div className="w-full max-w-4xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CompanySinceComp;
