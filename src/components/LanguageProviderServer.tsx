
import { cookies } from "next/headers";

import { LanguageProvider } from "@/components/LanguageProvider";
import type { Lang } from "@/lib/i18n";

export default async function LanguageProviderServer({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const savedLanguage = cookieStore.get("lang")?.value;

  const initialLang: Lang =
    savedLanguage === "bn" ? "bn" : "en";

  return (
    <LanguageProvider initialLang={initialLang}>
      {children}
    </LanguageProvider>
  );
}
