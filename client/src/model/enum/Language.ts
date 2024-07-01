export enum Language {
    FRENCH,
    ENGLISH
}

export function languageToString(language: Language): string {
    switch (language) {
        case Language.FRENCH:
            return "Français";
        case Language.ENGLISH:
            return "Anglais";
        default:
            return "Inconnue";
    }
}