import React, { ReactNode } from "react";
import StyledComponentsRegistry from "lib/registry";
import GlobalStyle from "src/styles/globalStyles";
import Maintenance from "src/containers/Maintenance";
import InnerLayout from "./InnerLayout";
import AuthProvider from "./authProvider";

interface Props {
  children: ReactNode;
}

const Layout = ({ children }: Props) => {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "1";

  return (
    <AuthProvider>
      <GlobalStyle />
      <Layout>
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
      </Layout>
    </AuthProvider>
  );
};

export default Layout;
