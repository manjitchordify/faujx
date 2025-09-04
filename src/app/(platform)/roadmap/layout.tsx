import '@/app/globals.css';
import { ReactFlowProvider } from '@xyflow/react';

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export default function roadmapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactFlowProvider>
      <main className="w-full ">{children}</main>
    </ReactFlowProvider>
  );
}
