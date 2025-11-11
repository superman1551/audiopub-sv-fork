import { get, writable } from "svelte/store";

type MessageDictionary = Record<string, string>;

interface LocaleModule {
  default: MessageDictionary;
  meta?: {
    code?: string;
    name: string;
    nativeName?: string;
  };
}

export interface LocaleInfo {
  code: string;
  name: string;
  nativeName: string;
}

const localeModules = import.meta.glob<LocaleModule>("./locales/*.ts", {
  eager: true
});

const dictionaries: Record<string, MessageDictionary> = {};
const metadata: Record<string, LocaleInfo> = {};

for (const path of Object.keys(localeModules)) {
  const module = localeModules[path];
  const mod = module as LocaleModule;
  const inferredCode = path.split("/").pop()?.replace(/\.\w+$/, "") ?? "";
  const code = (mod.meta?.code ?? inferredCode).toLowerCase();

  if (!code) {
    throw new Error(`Unable to infer locale code for module ${path}`);
  }
  if (!mod.default) {
    throw new Error(`Locale module ${path} is missing a default export.`);
  }

  dictionaries[code] = mod.default;
  metadata[code] = {
    code,
    name: mod.meta?.name ?? code,
    nativeName: mod.meta?.nativeName ?? mod.meta?.name ?? code
  };
}

const localeCodes = Object.keys(dictionaries);

if (localeCodes.length === 0) {
  throw new Error("No locale dictionaries were found under ./locales");
}

const FALLBACK_LOCALE = dictionaries.en ? "en" : localeCodes[0];

function normalizeLocale(candidate: string | null | undefined): string | null {
  if (!candidate) return null;
  const normalized = candidate.toLowerCase();
  if (dictionaries[normalized]) return normalized;
  const base = normalized.split("-")[0];
  if (dictionaries[base]) return base;
  return null;
}

function detectInitial(): string {
  if (typeof localStorage !== "undefined") {
    const saved = normalizeLocale(localStorage.getItem("locale"));
    if (saved) return saved;
  }

  if (typeof navigator !== "undefined") {
    const candidates = navigator.languages ?? [navigator.language];
    for (const lang of candidates) {
      const normalized = normalizeLocale(lang);
      if (normalized) return normalized;
    }
  }

  return FALLBACK_LOCALE;
}

export type Locale = string;

export const locale = writable<Locale>(detectInitial());

locale.subscribe((loc: Locale) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = loc;
  }
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("locale", loc);
  }
});

function getDictionary(loc: Locale) {
  return dictionaries[loc] ?? dictionaries[FALLBACK_LOCALE];
}

export function translate(
  key: string,
  params?: Record<string, unknown>,
  loc?: Locale
): string {
  const currentLocale = loc ?? get(locale);
  let template = getDictionary(currentLocale)?.[key];
  if (template === undefined) {
    template = getDictionary(FALLBACK_LOCALE)?.[key] ?? key;
  }

  if (!params) {
    return template;
  }

  return Object.keys(params).reduce((acc, param) => {
    return acc.replace(new RegExp(`\\{${param}\\}`, "g"), String(params[param]));
  }, template);
}

export const t = translate;

export const availableLocales: LocaleInfo[] = Object.keys(metadata)
  .map((code) => metadata[code])
  .sort((a, b) => a.nativeName.localeCompare(b.nativeName));

export function setLocale(next: Locale) {
  const normalized = normalizeLocale(next) ?? FALLBACK_LOCALE;
  locale.set(normalized);
}

export function pageTitle(key: string, params?: Record<string, unknown>, loc?: Locale) {
  const brand = translate("title.brand", undefined, loc);
  const body = translate(key, params, loc);
  return `${body} | ${brand}`;
}
