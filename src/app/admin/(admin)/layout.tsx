import { authOptions } from "@app/api/v1/auth/[...nextauth]/route";
import LayoutAdmin from "@components/admin/layout/layout-admin";
import { Role } from "@type/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  console.log("🚀 ~ AdminLayout ~ session:", session)

  if (!session || session?.user?.role !== Role.admin) {
    redirect("/admin");
  }

  return (
    <LayoutAdmin>
      {children}
    </LayoutAdmin>
  );
}