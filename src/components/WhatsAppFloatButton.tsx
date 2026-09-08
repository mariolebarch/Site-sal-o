import { business } from "../data/business";

export function WhatsAppFloatButton() {
  return (
    <a
      href={business.whatsappLink}
      target="_blank"
      rel="noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-[#25D366] text-white pl-3.5 pr-4 py-3.5 shadow-[0_8px_24px_-6px_rgba(37,211,102,0.6)] hover:scale-105 active:scale-95 transition-transform"
    >
      <svg viewBox="0 0 32 32" className="h-6 w-6 fill-white">
        <path d="M16.02 3C9.4 3 4 8.4 4 15.02c0 2.36.66 4.56 1.8 6.44L4 29l7.72-1.75a12 12 0 0 0 4.3.8c6.62 0 12.02-5.4 12.02-12.03C28.04 8.4 22.64 3 16.02 3Zm0 21.8c-1.6 0-3.13-.42-4.47-1.22l-.32-.19-4.58 1.04 1.06-4.47-.21-.34a9.75 9.75 0 0 1-1.5-5.6c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.08 1.02 6.94 2.88a9.72 9.72 0 0 1 2.87 6.92c0 5.4-4.4 9.78-9.61 9.78Zm5.36-7.33c-.29-.15-1.74-.86-2-.96-.27-.1-.47-.15-.66.15-.2.29-.76.95-.93 1.15-.17.19-.34.22-.63.07-.29-.15-1.23-.45-2.34-1.44a8.7 8.7 0 0 1-1.62-2.01c-.17-.29-.02-.45.13-.6.13-.13.29-.34.44-.5.15-.18.19-.3.29-.49.1-.2.05-.37-.02-.52-.08-.15-.66-1.58-.9-2.16-.24-.57-.48-.49-.66-.5h-.56c-.2 0-.51.07-.78.37-.27.29-1.02 1-1.02 2.43s1.05 2.82 1.19 3.01c.15.2 2.06 3.15 5 4.41.7.3 1.25.48 1.67.61.7.22 1.34.19 1.84.12.56-.08 1.74-.71 1.99-1.4.24-.68.24-1.27.17-1.4-.07-.12-.27-.2-.56-.34Z" />
      </svg>
      <span className="hidden sm:inline text-sm font-semibold">Agendar no WhatsApp</span>
    </a>
  );
}
