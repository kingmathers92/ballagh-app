export const RECITERS = [
  { id: "alafasy", name: "Mishary Alafasy", nameAr: "مشاري العفاسي", folder: "Alafasy_128kbps" },
  { id: "abdulbasit", name: "Abdul Basit", nameAr: "عبد الباسط عبد الصمد", folder: "Abdul_Basit_Murattal_192kbps" },
  { id: "sudais", name: "Al-Sudais", nameAr: "عبد الرحمن السديس", folder: "Abdurrahmaan_As-Sudais_192kbps" },
  { id: "husary", name: "Al-Husary", nameAr: "محمود خليل الحصري", folder: "Husary_128kbps" },
  { id: "shuraym", name: "Al-Shuraim", nameAr: "سعود الشريم", folder: "Saood_ash-Shuraym_128kbps" },
  { id: "maher", name: "Maher Al-Muaiqly", nameAr: "ماهر المعيقلي", folder: "MaherAlMuaiqly128kbps" },
  { id: "hudhaify", name: "Al-Hudhaify", nameAr: "علي الحذيفي", folder: "Hudhaify_128kbps" },
  { id: "dossari", name: "Yasser Al-Dosari", nameAr: "ياسر الدوسري", folder: "Yasser_Ad-Dussary_128kbps" },
  { id: "shatri", name: "Abu Bakr Al-Shatri", nameAr: "أبو بكر الشاطري", folder: "Abu_Bakr_Ash-Shaatree_128kbps" },
  { id: "ajmy", name: "Ahmed Al-Ajmy", nameAr: "أحمد العجمي", folder: "ahmed_ibn_ali_al_ajamy_128kbps" },
];

export const DEFAULT_RECITER_ID = "alafasy";

export const getReciterById = (id) =>
  RECITERS.find((r) => r.id === id) || RECITERS[0];

export const getAyahAudioUrl = (reciterFolder, surahNumber, numberInSurah) => {
  const surah = String(surahNumber).padStart(3, "0");
  const ayah = String(numberInSurah).padStart(3, "0");
  return `https://everyayah.com/data/${reciterFolder}/${surah}${ayah}.mp3`;
};
