import LayoutAdmin from "@components/admin/layout/layout-admin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutAdmin>
      {children}
    </LayoutAdmin>
  );
}