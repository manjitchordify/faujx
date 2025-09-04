export const engineerRoles = [
  {
    id: 'frontend',
    name: 'Front-end',
    jd_s3_key: 'Jr. FE-React JD.docx',
  },
  {
    id: 'backend',
    name: 'Back-end',
    jd_s3_key: 'Jr. BE-Node JD.docx',
  },
  {
    id: 'devops',
    name: 'Devops',
    jd_s3_key: 'Jr.DevOps-JD.docx',
  },
  {
    id: 'aiml',
    name: 'AI/ML',
    jd_s3_key: 'Jr. AIML JD.docx',
  },
  {
    id: 'fullstack',
    name: 'Full-Stack',
    jd_s3_key: 'Jr. Fullstack JD.docx',
  },
];

export const get_jd_s3_key_role = (role: string) => {
  const data = engineerRoles.find(item => item.name == role || item.id == role);
  return data?.jd_s3_key || 'Jr. Fullstack JD.docx';
};

export const addHoursToISOString = (
  isoString: string,
  hours: number
): string => {
  const date = new Date(isoString);
  date.setHours(date.getHours() + hours);
  return date.toISOString();
};

// Convert to IST : 12-03-2025 - 02:00 PM
export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const parts = new Intl.DateTimeFormat('en-GB', options).formatToParts(date);

  const day = parts.find(p => p.type === 'day')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const year = parts.find(p => p.type === 'year')?.value;
  const hour = parts.find(p => p.type === 'hour')?.value;
  const minute = parts.find(p => p.type === 'minute')?.value;
  const dayPeriod = parts.find(p => p.type === 'dayPeriod')?.value;

  return `${day}-${month}-${year} - ${hour}:${minute} ${dayPeriod}`;
}

// FAKE DELAY CUSTOM API CALL
export async function delayReturn<T>(value: T, time: number): Promise<T> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(value);
    }, time * 1000); // 5 seconds delay
  });
}

export function getDatePart(
  date: Date,
  part: 'd' | 'm' | 'h' | 's' | 'y'
): number {
  switch (part) {
    case 'd': // Day
      return date.getDate();
    case 'm': // Month (1–12)
      return date.getMonth() + 1;
    case 'h': // Hours (0–23)
      return date.getHours();
    case 's': // Seconds
      return date.getSeconds();
    case 'y': // Full Year
      return date.getFullYear();
    default:
      return 0;
  }
}

export function formatInterviewDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'short', // Thu
    day: '2-digit', // 14
    month: 'short', // Aug
    year: 'numeric', // 2025
  };

  return new Intl.DateTimeFormat('en-GB', options).format(date);
}

export function compareDates(
  date1: Date,
  date2: Date
): 'upcoming' | 'past' | 'same' {
  const time1 = date1.getTime();
  const time2 = date2.getTime();

  if (time1 > time2) return 'upcoming'; // date1 is in future compared to date2
  if (time1 < time2) return 'past'; // date1 is in past compared to date2
  return 'same'; // dates are equal
}
