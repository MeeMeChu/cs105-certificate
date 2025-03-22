"use server";

export async function createUser(formData: FormData) {
  const firstName = formData.get("firstName");
  console.log("🚀 ~ updateRole ~ firstName:", firstName)
  const lastName = formData.get("lastName");
  console.log("🚀 ~ updateRole ~ lastName:", lastName)
  const email = formData.get("email");
  console.log("🚀 ~ createUser ~ email:", email)
  const password = formData.get("password");
  console.log("🚀 ~ updateRole ~ password:", password)
  const role = formData.get("role");
  console.log("🚀 ~ updateRole ~ role:", role)
}