import Portal from "../components/graphics/portal";
import { useLogin } from "@privy-io/react-auth";
import { GetServerSideProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { verifyPrivyAccessToken } from "../lib/privy";

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
  const router = useRouter();
  const { login } = useLogin({
    onComplete: () => router.push("/dashboard"),
  });

  return (
    <>
      <Head>
        <title>Login · Privy</title>
      </Head>

      <main className="flex min-h-screen min-w-full">
        <div className="flex bg-privy-light-blue flex-1 p-6 justify-center items-center">
          <div>
            <div>
              <Portal style={{ maxWidth: "100%", height: "auto" }} />
            </div>
            <div className="mt-6 flex justify-center text-center">
              <button
                className="bg-violet-600 hover:bg-violet-700 py-3 px-6 text-white rounded-lg"
                onClick={login}
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
