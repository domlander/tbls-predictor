import React, { ReactNode } from "react";
import Maintenance from "src/containers/Maintenance";
import AuthProvider from "./AuthProvider";
import InnerLayout from "./InnerLayout";
import { chivo } from "./fonts";
import "./globals.css";

interface Props {
  children: ReactNode;
}

const RootLayout = ({ children }: Props) => {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "1";

  return (
    <AuthProvider>
      {isMaintenanceMode ? (
        <Maintenance />
      ) : (
        <html lang="en" className={chivo.className}>
          <body>
            <InnerLayout>{children}</InnerLayout>
          </body>
        </html>
      )}
    </AuthProvider>
  );
};

export default RootLayout;
