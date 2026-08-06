import { gregorianToHijri, hijriToGregorian } from "@tabby_ai/hijri-converter";

const HIJRI_MONTHS_EN = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

const HIJRI_MONTHS_AR = [
  "محرم",
  "صفر",
  "ربيع الأول",
  "ربيع الآخر",
  "جمادى الأولى",
  "جمادى الآخرة",
  "رجب",
  "شعبان",
  "رمضان",
  "شوال",
  "ذو القعدة",
  "ذو الحجة",
];

/**
 * Returns the Hijri date for a given Gregorian date (or today).
 * @param {Date} date
 * @returns {{year: number, month: number, day: number, nameEn: string, nameAr: string}}
 */
export const getHijriDate = (date = new Date()) => {
  const hijri = gregorianToHijri({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
  return {
    ...hijri,
    nameEn: HIJRI_MONTHS_EN[hijri.month - 1],
    nameAr: HIJRI_MONTHS_AR[hijri.month - 1],
  };
};

/**
 * Returns the Gregorian start date of the current or next upcoming
 * Ramadan (1 Ramadan), computed dynamically rather than hardcoded -
 * correct every year, including while Ramadan is in progress.
 * @param {Date} date - reference "today"
 * @returns {Date}
 */
export const getRamadanStart = (date = new Date()) => {
  const todayHijri = getHijriDate(date);
  const targetHijriYear =
    todayHijri.month <= 9 ? todayHijri.year : todayHijri.year + 1;
  const { year, month, day } = hijriToGregorian({
    year: targetHijriYear,
    month: 9,
    day: 1,
  });
  return new Date(year, month - 1, day);
};
