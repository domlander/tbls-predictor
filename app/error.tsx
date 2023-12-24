"use client";

import { useEffect } from "react";
import ErrorComponent from "src/components/ErrorPage";

const ErrorPage = ({ error }: { error: Error & { digest?: string } }) => {
  useEffect(() => {
    throw new Error(error?.digest || "An error has occurred");
  }, [error]);

  return (
    <div>
      <ErrorComponent type="500" />
    </div>
  );
};

export default ErrorPage;
