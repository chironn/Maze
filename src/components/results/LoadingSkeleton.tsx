import { useState, useEffect } from 'react';

export function LoadingSkeleton() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const tips = ['正在连接天机...', '卦象推演中...', '解析玄机...', '即将揭晓...'];
  const tipIndex = Math.min(Math.floor(elapsed / 15), tips.length - 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="relative w-8 h-8">
          <div className="absolute inset-0 border-2 border-primary/30 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <span className="text-primary font-medium">{tips[tipIndex]}</span>
      </div>

      <div className="animate-pulse space-y-3">
        <div className="h-4 bg-primary/20 rounded w-3/4"></div>
        <div className="h-4 bg-primary/20 rounded w-full"></div>
        <div className="h-4 bg-primary/20 rounded w-5/6"></div>
        <div className="h-4 bg-primary/20 rounded w-full"></div>
        <div className="h-4 bg-primary/20 rounded w-4/5"></div>
      </div>

      <p className="text-xs text-text/40 text-center">
        已等待 {elapsed} 秒，AI 解析通常需要 30-60 秒
      </p>
    </div>
  );
}
