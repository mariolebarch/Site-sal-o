import { business } from "../data/business";
import { formatDateBR } from "./slots";

export function buildWhatsAppMessage(params: {
  serviceNames: string[];
  date: string;
  startTime: string;
  clientName: string;
}) {
  const { serviceNames, date, startTime, clientName } = params;
  const text =
    `Olá, Rosely! 💅 Meu nome é ${clientName}.\n` +
    `Gostaria de confirmar meu agendamento:\n\n` +
    `Procedimento(s): ${serviceNames.join(" + ")}\n` +
    `Data: ${formatDateBR(date)}\n` +
    `Horário: ${startTime}\n\n` +
    `Fico no aguardo da confirmação. Obrigada!`;
  return text;
}

export function buildReminderMessage(params: {
  serviceNames: string[];
  date: string;
  startTime: string;
  clientName: string;
}) {
  const { serviceNames, date, startTime, clientName } = params;
  return (
    `Oi, ${clientName}! 💅 Aqui é a Rosely, do Studio Rosely Lebarch.\n` +
    `Passando para lembrar do seu horário:\n\n` +
    `Procedimento(s): ${serviceNames.join(" + ")}\n` +
    `Data: ${formatDateBR(date)}\n` +
    `Horário: ${startTime}\n\n` +
    `Te espero! Qualquer imprevisto, é só me avisar por aqui. 😊`
  );
}

export function whatsappLinkWithMessage(message?: string) {
  if (!message) return business.whatsappLink;
  return `${business.whatsappLink}?text=${encodeURIComponent(message)}`;
}

export function whatsappLinkToPhone(phone: string, message?: string) {
  const digits = phone.replace(/\D/g, "");
  return message
    ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
    : `https://wa.me/${digits}`;
}
