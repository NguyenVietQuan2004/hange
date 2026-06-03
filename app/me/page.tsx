import HeaderLayout from "@/components/layout/header-layout";
import MeClientPage from "./me-client";
import FooterLayout from "@/components/layout/footer-layout";

function MePage() {
  return (
    <HeaderLayout>
      <FooterLayout>
        <MeClientPage />
      </FooterLayout>
    </HeaderLayout>
  );
}

export default MePage;
