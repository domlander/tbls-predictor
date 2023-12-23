"use client";

import { useFormStatus } from "react-dom";

import Button from "src/components/Button";
import styles from "./FeedbackAndButton.module.css";

// This component needs to be a child component of the form to use useFormStatus()
// https://react.dev/reference/react-dom/hooks/useFormStatus#useformstatus-will-not-return-status-information-for-a-form-rendered-in-the-same-component
const FeedbackAndButton = ({ message }: { message?: string }) => {
  const { pending } = useFormStatus();

  return (
    <>
      {message && !pending && <p className={styles.feedback}>{message}</p>}
      <div className={styles.buttonContainer}>
        <Button type="submit" disabled={pending} variant="primary">
          {pending ? "Loading..." : "Create"}
        </Button>
      </div>
    </>
  );
};

export default FeedbackAndButton;
