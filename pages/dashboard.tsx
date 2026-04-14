import type { GetServerSideProps } from "next";
import dynamic from "next/dynamic";

const DashboardPageClient = dynamic(
  () => import("../components/dashboard-page-client"),
  { ssr: false },
);

export const getServerSideProps: GetServerSideProps = async () => {
  return { props: {} };
};

export default function DashboardPage() {
  return <DashboardPageClient />;
}
