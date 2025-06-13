import LayoutAdmin from "@components/admin/layout/layout-admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // const session = await getServerSession(authOptions);
  // console.log("🚀 ~ AdminLayout ~ session:", session)

  // if (!session || session?.user?.role !== Role.admin) {
  //   redirect("/admin");
  // }

  return (
    <LayoutAdmin>
      {children}
    </LayoutAdmin>
  );
}