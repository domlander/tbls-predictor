"use client";

import { MouseEvent, ReactNode } from "react";
import styles from "./Button.module.css";

export type Props = {
  variant: "primary" | "secondary";
  children: ReactNode;
  disabled?: boolean;
  handleClick?: (e: MouseEvent<HTMLElement>) => void;
  id?: string;
  type?: "button" | "submit";
  size?: "small" | "regular";
};

const Button = ({
  variant,
  children,
  disabled = false,
  handleClick,
  id,
  type = "button",
  size = "regular",
}: Props) => (
  <button
    className={[
      styles.button,
      disabled && styles.disabled,
      variant === "primary" && styles.primary,
      variant === "secondary" && styles.secondary,
      size === "small" && styles.small,
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
