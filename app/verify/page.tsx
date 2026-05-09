import { Suspense } from "react";
import VerifyClient from "./verify-client";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyClient />
    </Suspense>
  );
}
