"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";

import updateUsername from "src/actions/updateUsername";
import Button from "../Button";
import FormInput from "../FormInput";
import Heading from "../Heading";
import styles from "./ChangeUsernameForm.module.css";

export interface Props {
  initialUsername: string;
}

const initialState = { message: "" };

const ChangeUsernameForm = ({ initialUsername }: Props) => {
  const [username, setUsername] = useState(initialUsername);
  const [state, formAction] = useFormState(updateUsername, initialState);
  const { pending } = useFormStatus();

  return (
    <section className={styles.container}>
      <Heading level="h2">Update username</Heading>
      <form action={formAction}>
        <label className={styles.label}>
          Username:
          <FormInput
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={20}
          />
        </label>
        <div className={styles.buttons}>
          <Button type="submit" disabled={pending} variant="primary">
            Update
          </Button>
        </div>
        {state && <p className={styles.feedback}>{state?.message}</p>}
      </form>
    </section>
  );
};

export default ChangeUsernameForm;
