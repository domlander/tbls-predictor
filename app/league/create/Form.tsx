"use client";

import { useFormState } from "react-dom";
import createLeague from "src/actions/createLeague";
import styles from "./Form.module.css";
import FeedbackAndButton from "./FeedbackAndButton";

interface Props {
  currentGameweek: number;
  userId: string;
}

const Form = ({ currentGameweek, userId }: Props) => {
  const [state, action] = useFormState(createLeague, null);

  return (
    <form className={styles.form} action={action}>
      <label htmlFor="name" className={styles.label}>
        Name:
        <input className={styles.input} name="name" minLength={3} />
      </label>
      <label htmlFor="start" className={styles.label}>
        Gameweek start:
        <input
          className={styles.input}
          name="start"
          type="number"
          defaultValue={currentGameweek + 1}
          min={currentGameweek}
          max={38}
        />
      </label>
      <p className={styles.info}>
        (Select a week between {currentGameweek + 1} and 38)
      </p>
      <label htmlFor="weeksToRun" className={styles.label}>
        Weeks to run:
        <input
          className={styles.input}
          name="weeksToRun"
          type="number"
          defaultValue={10}
          min={1}
          max={38 - currentGameweek}
        />
      </label>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="currentGameweek" value={currentGameweek} />
      <FeedbackAndButton message={state?.message} />
    </form>
  );
};

export default Form;
