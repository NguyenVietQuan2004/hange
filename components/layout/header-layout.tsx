import Header from "../header";

function HeaderLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col mt-4 md:mt-0">{children}</div>
    </div>
  );
}

export default HeaderLayout;
