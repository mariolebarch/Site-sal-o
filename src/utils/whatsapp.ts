import { business } from "../data/business";
import { formatDateBR } from "./slots";

export function buildWhatsAppMessage(params: {
  serviceName: string;
  date: string;
  startTime: string;
  clientName: string;
}) {
  const { serviceName, date, startTime, clientName } = params;
  const text =
    `Olá, Rosely! 💅 Meu nome é ${clientName}.\n` +
    `Gostaria de confirmar meu agendamento:\n\n` +
    `Procedimento: ${serviceName}\n` +
    `Data: ${formatDateBR(date)}\n` +
    `Horário: ${startTime}\n\n` +
    `Fico no aguardo da confirmação. Obrigada!`;
  return text;
}

export function whatsappLinkWithMessage(message?: string) {
  if (!message) return business.whatsappLink;
  return `${business.whatsappLink}?text=${encodeURIComponent(message)}`;
}
