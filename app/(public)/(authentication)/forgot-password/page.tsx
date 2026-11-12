import { AuthCardLayout } from "@/components/form/auth-card-layout"
import { ForgotPasswordForm } from "@/components/form/forgot-password-form"


export default function ForgotPasswordPage() {
  return (
    <AuthCardLayout
      caption="Forgot your password?"
      subcaption="No worries. We'll send a code to your email so you can set a new one."
    >
      <ForgotPasswordForm />
    </AuthCardLayout>
  )
}