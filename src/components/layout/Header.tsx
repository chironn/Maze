export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-apple">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          ☯
        </div>
        <span className="text-xl font-semibold text-text">迷津</span>
      </div>
    </header>
  );
}
