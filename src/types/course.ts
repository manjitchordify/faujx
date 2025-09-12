// types/course.ts

export interface Technology {
  name: string;
  color?: string;
}

export interface CoursePrice {
  india: string; // e.g. "₹20000"
  apac: string; // e.g. "$250"
  global: string; // e.g. "$350"
}

export interface CourseData {
  title: string;
  description: string;
  price: CoursePrice; // ✅ replaced number with object
  technologies: Technology[];
  image: string;
}

export interface CourseDataMap {
  [key: string]: CourseData;
}
