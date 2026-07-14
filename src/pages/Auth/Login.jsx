import AuthLayout from '../../components/auth/AuthLayout';
import LoginForm from '../../components/auth/LoginForm';

export default function Login() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Enter your credentials to access your GameHub account."
    >
      <LoginForm />
    </AuthLayout>
  );
}
