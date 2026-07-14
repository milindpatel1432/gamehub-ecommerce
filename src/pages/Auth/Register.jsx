import AuthLayout from '../../components/auth/AuthLayout';
import RegisterForm from '../../components/auth/RegisterForm';

export default function Register() {
  return (
    <AuthLayout
      title="Create Elite Account"
      subtitle="Register now to start renting and purchasing premium gear."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
