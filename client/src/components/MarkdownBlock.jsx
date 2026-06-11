export function MarkdownBlock({ text }) {
  return (
    <div className="whitespace-pre-wrap rounded-lg border border-cyan-200/12 bg-black/20 p-4 text-sm leading-7 text-slate-100">
      {text || 'Natija hali mavjud emas'}
    </div>
  );
}
