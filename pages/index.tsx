import { GetServerSideProps } from "next";
import Head from "next/head";
import dynamic from "next/dynamic";
import { verifyPrivyAccessToken } from "../lib/privy";

const LoginPageClient = dynamic(
  () => import("../components/login-page-client"),
  { ssr: false },
);

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const cookieAuthToken = req.cookies["privy-token"];

  // If no cookie is found, skip any further checks
  if (!cookieAuthToken) return { props: {} };

  try {
    await verifyPrivyAccessToken(cookieAuthToken);

    return {
      props: {},
      redirect: { destination: "/dashboard", permanent: false },
    };
  } catch (error) {
    console.error("Failed to verify Privy token during SSR redirect", error);
    return { props: {} };
  }
};

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Login · Privy</title>
      </Head>
      <LoginPageClient />
    </>
  );
}
