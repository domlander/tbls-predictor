"use client";

import { MouseEvent, ReactNode } from "react";
import styles from "./Button.module.css";

export type Props = {
  children: ReactNode;
  disabled?: boolean;
  handleClick?: (e: MouseEvent<HTMLElement>) => void;
  id?: string;
  type?: "button" | "submit";
  variant: "primary" | "secondary";
};

const Button = ({
  children,
  disabled = false,
  handleClick,
  id,
  type = "button",
  variant,
}: Props) => (
  <button
    className={[
      styles.button,
      disabled && styles.disabled,
      variant === "primary" && styles.primary,
      variant === "secondary" && styles.secondary,
    ].join(" ")}
    disabled={disabled}
    id={id}
    onClick={handleClick}
    type={type}
  >
    {children}
  </button>
);

export default Button;
