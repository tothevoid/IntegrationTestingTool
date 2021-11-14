import i18n from "i18next";
import XHR from "i18next-xhr-backend";

import {TRANSLATION_EN} from "./locales/en/translation"
import {TRANSLATION_RU} from "./locales/ru/translation";

i18n
    .use(XHR)
    .init({
    // we init with resources
    lng: "en",
    fallbackLng: "en",
    debug: false,
    interpolation: {
        escapeValue: false,
        formatSeparator: ","
    },
    resources: {
        en: {
            translation: TRANSLATION_EN
        },
        ru: {
            translation: TRANSLATION_RU
        },
    },
    react: {
        useSuspense: false
    }
});

export default i18n;