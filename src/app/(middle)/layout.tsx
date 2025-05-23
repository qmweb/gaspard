import Layout from '@/app/_components/layout/middle/Layout';

export default function MiddleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
