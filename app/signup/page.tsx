import { redirect } from "next/navigation"

export default function SignupRedirect() {
  // Redirect to the signup options page
  redirect("/signup/options")
}
