import { LinkManagement } from "@/components/link-management";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ code?: string | string[] }>;
}) {
  const { code } = await searchParams;
  return <LinkManagement initialCode={typeof code === "string" ? code : ""} />;
}
