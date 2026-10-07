import { useEffect } from "react";
import { SiteNav } from "@/components/SiteNav";
import { InstagramLanding } from "@/components/InstagramLanding";
import { applyInstagramMetadata } from "@/lib/instagramMetadata";

export default function InstagramPage() {
  useEffect(applyInstagramMetadata, []);

  return (
    <div className="min-h-screen">
      <SiteNav active="instagram" />
      <InstagramLanding />
    </div>
  );
}
