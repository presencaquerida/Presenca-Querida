import { notFound } from "next/navigation";
import { getGuestByToken } from "@/lib/data";
import { InviteClient } from "./InviteClient";

export const dynamic = "force-dynamic";

export default async function ConvitePage({ params }: { params: { token: string } }) {
  const data = await getGuestByToken(params.token);
  if (!data) notFound();
  return <InviteClient bundle={data.bundle} guest={data.guest} />;
}
