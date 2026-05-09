import Footer from "../footer";

function FooterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex-1 flex flex-col ">
      <div className="pb-10 lg:pb-0">{children}</div>

      <Footer />
    </div>
  );
}

export default FooterLayout;
