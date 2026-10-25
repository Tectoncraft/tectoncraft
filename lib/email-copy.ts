import type { Locale } from "@/config/site";

/** Double opt-in confirmation mail, per locale. */
export const newsletterMail: Record<Locale, { subject: string; body: string; cta: string }> = {
  en: {
    subject: "Confirm your Tectoncraft newsletter subscription",
    body: "Please confirm your email address to receive our newsletter. If you didn't sign up, ignore this message.",
    cta: "Confirm subscription",
  },
  de: {
    subject: "Bitte bestätigen Sie Ihre Newsletter-Anmeldung bei Tectoncraft",
    body: "Bitte bestätigen Sie Ihre E-Mail-Adresse, um unseren Newsletter zu erhalten. Wenn Sie sich nicht angemeldet haben, ignorieren Sie diese Nachricht.",
    cta: "Anmeldung bestätigen",
  },
  el: {
    subject: "Επιβεβαιώστε την εγγραφή σας στο newsletter της Tectoncraft",
    body: "Επιβεβαιώστε τη διεύθυνση email σας για να λαμβάνετε το newsletter μας. Αν δεν κάνατε εσείς την εγγραφή, αγνοήστε αυτό το μήνυμα.",
    cta: "Επιβεβαίωση εγγραφής",
  },
};
