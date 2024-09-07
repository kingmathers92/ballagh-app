export function arabicNum(number) {
  const arabicNumerals = "٠١٢٣٤٥٦٧٨٩";
  return number
    .toString()
    .split("")
    .map((digit) => arabicNumerals[digit])
    .join("");
}
