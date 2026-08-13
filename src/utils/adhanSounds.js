export const ADHAN_SOUNDS = [
  {
    id: "a9",
    name: "Mishary Rashid Alafasy",
    url: "https://cdn.aladhan.com/audio/adhans/a9.mp3",
  },
  {
    id: "a4",
    name: "Mishary Rashid Alafasy (Dubai One TV)",
    url: "https://cdn.aladhan.com/audio/adhans/a4.mp3",
  },
  {
    id: "a7",
    name: "Mishary Rashid Alafasy (alternate)",
    url: "https://cdn.aladhan.com/audio/adhans/a7.mp3",
  },
  {
    id: "a11",
    name: "Mansour Al-Zahrani",
    url: "https://cdn.aladhan.com/audio/adhans/a11-mansour-al-zahrani.mp3",
  },
  {
    id: "a1",
    name: "Ahmad al-Nafees",
    url: "https://cdn.aladhan.com/audio/adhans/a1.mp3",
  },
  {
    id: "a2",
    name: "Hafiz Mustafa Özcan (Turkey)",
    url: "https://cdn.aladhan.com/audio/adhans/a2.mp3",
  },
];

export const DEFAULT_ADHAN_ID = "a9";

export const getAdhanById = (id) =>
  ADHAN_SOUNDS.find((a) => a.id === id) || ADHAN_SOUNDS[0];
