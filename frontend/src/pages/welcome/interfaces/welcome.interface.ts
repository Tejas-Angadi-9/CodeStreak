import type { JSX } from "react/jsx-runtime";

export interface IWelcomeFeatureList {
  id: number;
  icon: JSX.Element;
  title: string;
}

export interface IWelcomeLoginResponse {
  message: string;
}
