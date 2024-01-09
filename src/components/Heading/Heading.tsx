import { ReactNode } from "react";
import styles from "./Heading.module.css";

type HeadingLevel = "h1" | "h2" | "h3" | "p";

export type Props = {
  level: HeadingLevel;
  children: ReactNode;
  as?: HeadingLevel;
  id?: string;
};

const Heading = ({ id, level, as, children }: Props) => {
  const Tag = as || level;

  return (
    <Tag id={id} className={[styles.heading, styles[level]].join(" ")}>
      {children}
    </Tag>
  );
};

export default Heading;
