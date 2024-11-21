"use client";

import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "./store/store";
import PageWrapper from "./(components)/pageWrapper";

export default function Home() {

  return (
    <Provider store={store}>
      <PageWrapper />
    </Provider>
  );
}
