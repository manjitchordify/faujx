import Head from 'next/head';
import Content from '@/components/main/Content';

export default function Home() {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Main home page of FaujX, allowing navigation to different landing pages based on user role."
        />
      </Head>
      <Content />
    </>
  );
}
