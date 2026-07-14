import AuthLayout from '../../components/auth/AuthLayout';
import ForgotPasswordForm from '../../components/auth/ForgotPasswordForm';

export default function ForgotPassword() {
  return (
    <AuthLayout
      title="Recover Password"
      subtitle="Enter your registered email address to receive recovery instructions."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
