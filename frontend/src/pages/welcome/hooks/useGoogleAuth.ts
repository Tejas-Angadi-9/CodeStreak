import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../../config/axiosClient";
import { useGoogleLogin } from "@react-oauth/google";
import { GOOGLE_AUTH } from "../constants/welcomeRoutes.constant";
import type { IWelcomeLoginResponse } from "../interfaces/welcome.interface";

const useGoogleAuth = () => {
  const navigate = useNavigate();

  const loginMutation = useMutation<IWelcomeLoginResponse, Error, string>({
    mutationFn: async (authCode) => {
      const loginResponse = await axiosClient.post(
        GOOGLE_AUTH,
        {
          accessCode: authCode,
        },
        { withCredentials: true },
      );
      return loginResponse.data;
    },
    onSuccess: (data) => {
      console.log("Login success response: ", data);
      navigate("/room");
    },
    onError: (error) => {
      console.error("Login endpoint failed: ", error.message);
    },
  });

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: (codeResponse) => {
      loginMutation.mutate(codeResponse.code);
    },
    onError: (error) => console.log("Login failed: ", error),
  });

  return {
    login,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
  };
};

export default useGoogleAuth;
