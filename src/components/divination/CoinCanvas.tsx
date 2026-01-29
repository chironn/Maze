import { useEffect, useRef } from 'react';

interface Coin {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  size: number;
  opacity: number;
  settled: boolean; // 是否已完全静止
}

interface CoinCanvasProps {
  isActive: boolean;
}

export function CoinCanvas({ isActive }: CoinCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const coinsRef = useRef<Coin[]>([]);
  const coinImageRef = useRef<HTMLImageElement | null>(null);
  const isActiveRef = useRef(isActive);
  const settledTimeRef = useRef<number>(0);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    // 预加载铜钱图片
    const img = new Image();
    img.src = '/Copper_coin.png';
    img.onload = () => {
      coinImageRef.current = img;
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const centerX = canvas.width / 2;
    const coinSize = 60;
    const groundY = canvas.height - 160;

    const resetCoins = () => {
      const spacing = 80;
      coinsRef.current = [
        {
          x: centerX - spacing + (Math.random() - 0.5) * 20,
          y: -60,
          vx: (Math.random() - 0.5) * 3,
          vy: 0,
          rotation: Math.random() * Math.PI * 2,
          size: coinSize,
          opacity: 1,
          settled: false,
        },
        {
          x: centerX + (Math.random() - 0.5) * 20,
          y: -100,
          vx: (Math.random() - 0.5) * 3,
          vy: 0,
          rotation: Math.random() * Math.PI * 2,
          size: coinSize,
          opacity: 1,
          settled: false,
        },
        {
          x: centerX + spacing + (Math.random() - 0.5) * 20,
          y: -80,
          vx: (Math.random() - 0.5) * 3,
          vy: 0,
          rotation: Math.random() * Math.PI * 2,
          size: coinSize,
          opacity: 1,
          settled: false,
        },
      ];
      settledTimeRef.current = 0;
    };

    resetCoins();

    const drawCoin = (coin: Coin) => {
      if (coin.opacity <= 0) return;
      
      ctx.save();
      ctx.globalAlpha = coin.opacity;
      ctx.translate(coin.x, coin.y);
      ctx.rotate(coin.rotation);

      // 阴影
      ctx.shadowColor = `rgba(0, 0, 0, ${0.4 * coin.opacity})`;
      ctx.shadowBlur = 15;
      ctx.shadowOffsetY = 8;

      if (coinImageRef.current) {
        ctx.drawImage(
          coinImageRef.current,
          -coin.size / 2,
          -coin.size / 2,
          coin.size,
          coin.size
        );
      } else {
        ctx.fillStyle = '#B8860B';
        ctx.beginPath();
        ctx.arc(0, 0, coin.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    };

    const animate = () => {
      if (!isActiveRef.current) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      let allSettled = true;

      coinsRef.current.forEach((coin) => {
        // 下落和弹跳物理
        if (!coin.settled) {
          coin.vy += 0.6; // 重力
          coin.y += coin.vy;
          coin.x += coin.vx;
          coin.rotation += 0.12;

          // 碰到地面
          if (coin.y >= groundY - coin.size / 2) {
            coin.y = groundY - coin.size / 2;
            
            // 弹跳：速度反向并衰减
            if (Math.abs(coin.vy) > 2) {
              coin.vy = -coin.vy * 0.5; // 反弹，能量损失50%
              coin.vx *= 0.8; // 水平速度衰减
              coin.rotation += (Math.random() - 0.5) * 0.5;
            } else {
              // 速度太小，停止弹跳
              coin.vy = 0;
              coin.vx = 0;
              coin.settled = true;
            }
          }
          allSettled = false;
        }

        drawCoin(coin);
      });

      // 检查是否全部落地静止
      if (allSettled && coinsRef.current.every(c => c.settled)) {
        if (settledTimeRef.current === 0) {
          settledTimeRef.current = now;
        }
        
        // 落地 0.5 秒后开始淡出
        const settledDuration = now - settledTimeRef.current;
        if (settledDuration > 500) {
          // 淡出
          coinsRef.current.forEach((coin) => {
            coin.opacity -= 0.05;
          });
          
          // 全部消失后重置
          if (coinsRef.current.every(c => c.opacity <= 0)) {
            resetCoins();
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = undefined;
      }
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
