export function ScoreRing({ value = 0, label = 'Baholash' }) {
  const score = Number.isFinite(value) ? value : 0;
  const color = score >= 70 ? '#34d399' : score >= 45 ? '#facc15' : '#fb7185';

  return (
    <div className="flex items-center gap-5">
      <div
        className="grid h-28 w-28 place-items-center rounded-full"
        style={{
          background: `conic-gradient(${color} ${score * 3.6}deg, rgba(255,255,255,.10) 0deg)`
        }}
      >
        <div className="grid h-20 w-20 place-items-center rounded-full bg-[#07101f]">
          <span className="text-2xl font-bold" style={{ color }}>{score}</span>
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-400">{label}</p>
        <p className="mt-1 text-xl font-semibold text-white">{score}/100</p>
      </div>
    </div>
  );
}
