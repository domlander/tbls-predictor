import React, { ReactNode } from "react";

import InnerLayout from "./InnerLayout";
import "../globals.css";

interface Props {
  children: ReactNode;
}

const RootLayout = ({ children }: Props) => {
  return <InnerLayout>{children}</InnerLayout>;
};

export default RootLayout;
