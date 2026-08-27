"use client";

import { useActionState } from "react";
import requestToJoinLeague from "src/actions/requestToJoinLeague";
import FeedbackAndButton from "./FeedbackAndButton";
import styles from "./Form.module.css";

const Form = () => {
  const [state, action] = useActionState(requestToJoinLeague, null);

  return (
    <form action={action} className={styles.form}>
      <label htmlFor="start" className={styles.label}>
        League ID:
        <input
          type="string"
          name="id"
          pattern="[0-9]*"
          className={styles.input}
          required
        />
      </label>
      <FeedbackAndButton message={state?.message} />
    </form>
  );
};

export default Form;
