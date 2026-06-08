import HeaderLayout from "@/components/layout/header-layout";
import FooterLayout from "@/components/layout/footer-layout";
import CreateBookingPage from "./create-booking";

export default function Page() {
  return (
    <HeaderLayout>
      <FooterLayout>
        <CreateBookingPage />
      </FooterLayout>
    </HeaderLayout>
  );
}
