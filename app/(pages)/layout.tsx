import InitUserClient from "./InitUserClient";

export default function UserRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <InitUserWrapper children={children} />;
}

export function InitUserWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <InitUserClient />
      {children}
    </>
  );
}
