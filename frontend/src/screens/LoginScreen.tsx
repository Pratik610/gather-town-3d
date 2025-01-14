import { LoginForm } from "@/components/login-form";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@/store";
const LoginScreen = () => {
  const navigate = useNavigate();

  const userLogin = useSelector((state: RootState) => state.userLogin);
  const { login } = userLogin;

  useEffect(() => {
    if (login) {
      navigate("/");
    }
  }, [userLogin, login, navigate]);

  return (
    <div className="bg-black">
      <div className="flex container border mx-auto  font-geist min-h-svh  items-center justify-center  bg-black p-6 md:p-10">
        <div className="absolute border top-0 left-0 p-5 w-full">
          <img src="./logo/White-Logo-Face.png" className="w-12 ms-5 " alt="" />
        </div>

        <div className="xl:w-8/12 ">
          <p
            style={{ lineHeight: "1.2em" }}
            className="text-6xl  bg-gradient-to-b bg-clip-text text-transparent from-zinc-100 to-zinc-500  text-center  font-bold"
          >
            Experience the New Way of Communications
          </p>
          <p className="text-lg text-zinc-500 font-medium  mt-5 text-center">
            Brings the best of in-person collaboration to distributed teams.
          </p>

          <div className="flex mt-10 justify-center ">
            <LoginForm />
          </div>
        </div>
        <div className="absolute border bottom-0 left-0 p-10 w-full"></div>
      </div>
    </div>
  );
};

export default LoginScreen;
