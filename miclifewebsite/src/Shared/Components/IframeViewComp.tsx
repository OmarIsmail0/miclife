'use client';
import { useSelector } from "react-redux";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const IframeViewComp = () => {
  const { direction } = useSelector((state: any) => state.language);
  const searchParams = useSearchParams();
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const urlParam = searchParams?.get('url');
    if (urlParam) {
      setUrl(urlParam);
    } else {
      // Redirect to home if no URL provided
      window.location.href = '/';
    }
  }, [searchParams]);

  if (!url) {
    return null;
  }

  return (
    <div className="mt-1" dir={direction}>
      <div className="w-full h-[80vh] flex flex-col">
        <iframe src={url} title="External Viewer" className="flex-1 border-none w-full" />
      </div>
    </div>
  );
};

export default IframeViewComp;
