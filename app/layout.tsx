import React, { ReactNode } from "react";
import GlobalStyle from "src/styles/globalStyles";
import Maintenance from "src/containers/Maintenance";
import StyledComponentsRegistry from "lib/registry";
import AuthProvider from "./AuthProvider";
import InnerLayout from "./InnerLayout";

interface Props {
  children: ReactNode;
}

const RootLayout = ({ children }: Props) => {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "1";

  return (
    <AuthProvider>
      <GlobalStyle />
      {isMaintenanceMode ? (
        <Maintenance />
      ) : (
        <html lang="en">
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
