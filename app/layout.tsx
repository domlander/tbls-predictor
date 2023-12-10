import React, { ReactNode } from "react";
import Maintenance from "src/containers/Maintenance";
import StyledComponentsRegistry from "lib/registry";
import AuthProvider from "./AuthProvider";
import InnerLayout from "./InnerLayout";
import { workSans } from "./fonts";
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
        <html lang="en" className={workSans.className}>
          <body>
            <StyledComponentsRegistry>
              <InnerLayout>{children}</InnerLayout>
            </StyledComponentsRegistry>
          </body>
        </html>
      )}
    </AuthProvider>
  );
};

export default RootLayout;
