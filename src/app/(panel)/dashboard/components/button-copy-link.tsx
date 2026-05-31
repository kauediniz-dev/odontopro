"use client";

import { Button } from "@/components/ui/button";
import { LinkIcon } from "lucide-react";
import { toast } from "sonner";

export function ButtonCopyLink({ userId }: { userId: string }) {
  const handleCopiLink = async () => {
    await navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_URL}/clinica/${userId}/agenda`,
    );

    toast.success("Link copiado para a área de transferência");
  };

  return (
    <Button onClick={handleCopiLink}>
      <LinkIcon className="w-5 h-5" />
    </Button>
  );
}
