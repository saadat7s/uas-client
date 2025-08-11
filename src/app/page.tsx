// Server component: send users to /register
import { redirect } from "next/navigation";

export default function Home() {
  redirect("/register");
}
