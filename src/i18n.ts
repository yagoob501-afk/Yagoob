// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)
    .use(initReactI18next)
    .init({
        fallbackLng: 'ar',
        debug: true,
        interpolation: {
            escapeValue: false, // react already escapes by default
        },
        backend: {
            loadPath: '/teacher-yagoob/locales/{{lng}}/common.json',
        },
    });

export default i18n;