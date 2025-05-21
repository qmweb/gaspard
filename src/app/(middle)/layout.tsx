import Layout from '@/client/components/layout/middle/Layout';

export default function MiddleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout>{children}</Layout>;
}
