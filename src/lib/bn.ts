// Bengali locale helpers: numerals, date formatting, relative time

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

const BN_MONTHS = [
  "জানুয়ারি",
  "ফেব্রুয়ারি",
  "মার্চ",
  "এপ্রিল",
  "মে",
  "জুন",
  "জুলাই",
  "আগস্ট",
  "সেপ্টেম্বর",
  "অক্টোবর",
  "নভেম্বর",
  "ডিসেম্বর",
];

const BN_DAYS = [
  "রবিবার",
  "সোমবার",
  "মঙ্গলবার",
  "বুধবার",
  "বৃহস্পতিবার",
  "শুক্রবার",
  "শনিবার",
];

export function toBn(input: number | string): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)]);
}

export function formatBnDate(date: Date, opts?: { withWeekday?: boolean }): string {
  const day = toBn(date.getDate());
  const month = BN_MONTHS[date.getMonth()];
  const year = toBn(date.getFullYear());
  if (opts?.withWeekday) {
    return `${BN_DAYS[date.getDay()]}, ${day} ${month} ${year}`;
  }
  return `${day} ${month} ${year}`;
}

export function formatBnTime(date: Date): string {
  let h = date.getHours();
  const m = toBn(date.getMinutes().toString().padStart(2, "0"));
  const ampm = h >= 12 ? "অপরাহ্ণ" : "পূর্বাহ্ণ";
  h = h % 12 || 12;
  return `${toBn(h)}:${m} ${ampm}`;
}

export function relativeTimeBn(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const sec = Math.floor(diffMs / 1000);
  if (sec < 60) return `এইমাত্র`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${toBn(min)} মিনিট আগে`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${toBn(hr)} ঘণ্টা আগে`;
  const day = Math.floor(hr / 24);
  if (day < 7) return `${toBn(day)} দিন আগে`;
  const week = Math.floor(day / 7);
  if (week < 4) return `${toBn(week)} সপ্তাহ আগে`;
  return formatBnDate(date);
}
