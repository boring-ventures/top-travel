import { NewOfferClient } from "./new-offer-client";

export default function NewOfferPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">New Offer</h1>
      </div>
      <NewOfferClient />
    </div>
  );
}
