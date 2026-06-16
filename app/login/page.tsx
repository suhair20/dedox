import { getCurrentSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

function getSafeRedirectPath(rawRedirect?: string) {
  if (!rawRedirect || !rawRedirect.startsWith("/") || rawRedirect.startsWith("//")) {
    return "/account";
  }

  return rawRedirect === "/login" ? "/account" : rawRedirect;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: { redirect?: string };
}) {
  const redirectTo = getSafeRedirectPath(searchParams?.redirect);
  const session = await getCurrentSession();

  if (session) {
    redirect(redirectTo);
  }

  return <LoginClient redirectTo={redirectTo} />;
}
