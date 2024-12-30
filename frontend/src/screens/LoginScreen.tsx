import { LoginForm } from "@/components/login-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const LoginScreen = () => {
  const navigate = useNavigate();

  const userLogin = useSelector((state: any) => state.userLogin);
  const { login } = userLogin;

  useEffect(() => {
    if (login) {
      navigate("/");
    }
  }, [userLogin, login,navigate]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-zinc-900 p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginScreen;
