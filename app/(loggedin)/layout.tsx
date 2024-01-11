import React, { ReactNode } from "react";

import AuthProvider from "./AuthProvider";
import InnerLayout from "./InnerLayout";
import "../globals.css";

interface Props {
  children: ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return (
    <AuthProvider>
      <InnerLayout>{children}</InnerLayout>
    </AuthProvider>
  );
};

export default RootLayout;
