import { ChangeEvent } from "react";
import styles from "./FormInput.module.css";

type Props = {
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  minLength?: number;
  maxLength?: number;
  type?: string;
  pattern?: string;
};

const FormInput = ({
  placeholder,
  name,
  value,
  onChange,
  minLength,
  maxLength,
  type = "text",
  pattern,
}: Props) => (
  <input
    type={type}
    name={name}
    value={value}
    className={styles.input}
    placeholder={placeholder}
    onChange={onChange}
    minLength={minLength}
    maxLength={maxLength}
    pattern={pattern}
  />
);

export default FormInput;
