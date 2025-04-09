import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push(`/attend`);
  }, []);
  return (
    <>
      <Head>
        <title>Eventra | Welcome</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </>
  );
}
