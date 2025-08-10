"use client";

import { useRouter } from "next/navigation";
import { OfferForm } from "@/components/admin/forms/offer-form";

export function NewOfferClient() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push("/cms/offers");
  };

  return <OfferForm onSuccess={handleSuccess} />;
}

