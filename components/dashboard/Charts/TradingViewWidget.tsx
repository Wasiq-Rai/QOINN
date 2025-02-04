"use client";
import { memo, useEffect, useRef } from "react";

function TradingViewWidget({stockName}:{stockName:string}) {
  //const container = useRef();
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const containerElement = container.current;
    if (!containerElement) return;

    // Clear previous content
    containerElement.innerHTML = "";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "symbol": "NASDAQ:${stockName}",
        "interval": "D",
        "timezone": "Etc/UTC",
        "theme": "light",
        "style": "1",
        "locale": "en",
        "enable_publishing": false,
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com"
      }`;
    
    containerElement.appendChild(script);

    return () => {
      containerElement.innerHTML = ""; 
    };
  }, [stockName]);


  return (
    <div className={`min-h-[50vh] my-auto h-full flex items-center justify-center flex-col mx-auto bg-slate-600 !w-full`}>
      <div
        className={`tradingview-widget-container !h-[500px] !w-full`}
        ref={container}
      >
        <div className="tradingview-widget-container__widget !h-full !w-[1000px]"></div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget);
