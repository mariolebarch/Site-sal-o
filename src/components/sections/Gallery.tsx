import { PhotoPlaceholder } from "../PhotoPlaceholder";
import { IconInstagram } from "../decor/Icons";
import { business } from "../../data/business";

const galleryItems = Array.from({ length: 8 }).map((_, i) => ({
  src: `/images/galeria-${i + 1}.jpg`,
  label: `Foto de trabalho #${i + 1} (Instagram)`,
}));

export function Gallery() {
  return (
    <section id="galeria" className="relative py-20 md:py-28 bg-cream-50">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold tracking-widest uppercase text-rose-600">
              Portfólio
            </span>
            <h2 className="mt-3 font-display text-3xl sm:text-4xl text-rose-900">Galeria de trabalhos</h2>
          </div>
          <a
            href={business.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700"
          >
            <IconInstagram className="h-4 w-4" /> Ver mais no {business.instagramHandle}
          </a>
        </div>

        <div className="mt-10 columns-2 sm:columns-3 lg:columns-4 gap-4 [&>*]:mb-4">
          {galleryItems.map((item, i) => (
            <PhotoPlaceholder
              key={item.src}
              src={item.src}
              alt={item.label}
              label={item.label}
              className={`w-full rounded-xl shadow-soft break-inside-avoid ${
                i % 5 === 0 ? "aspect-[3/4]" : i % 3 === 0 ? "aspect-square" : "aspect-[4/5]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
