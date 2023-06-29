export function ErrorComponent({ errorMessage }: { errorMessage?: string }) {
  return (
    <div className="flex flex-1 items-center justify-center p-16">
      <p className="w-[360px] text-center leading-relaxed">
        {errorMessage ?? "Erro"}
      </p>
    </div>
  );
}
