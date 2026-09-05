import { useState } from "react";
import { Camera } from "lucide-react";
import clsx from "clsx";

interface PhotoPlaceholderProps {
  src: string;
  alt: string;
  label: string;
  className?: string;
  imgClassName?: string;
}

export function PhotoPlaceholder({ src, alt, label, className, imgClassName }: PhotoPlaceholderProps) {
  const [errored, setErrored] = useState(false);
  const resolvedSrc = import.meta.env.BASE_URL + src.replace(/^\//, "");

  if (errored) {
    return (
      <div
        className={clsx(
          "relative flex flex-col items-center justify-center gap-3 overflow-hidden bg-gradient-to-br from-blush-100 via-blush-200 to-gold-300/40 text-center p-6",
          className
        )}
      >
        <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_20%_20%,white,transparent_35%),radial-gradient(circle_at_80%_80%,white,transparent_35%)]" />
        <Camera className="relative h-8 w-8 text-rose-600/70" strokeWidth={1.5} />
        <p className="relative font-display text-sm text-rose-800/80 max-w-[16rem]">{label}</p>
        <span className="relative text-[11px] uppercase tracking-wider text-rose-600/60">
          Substitua em {src}
        </span>
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={clsx("object-cover", className, imgClassName)}
    />
  );
}
