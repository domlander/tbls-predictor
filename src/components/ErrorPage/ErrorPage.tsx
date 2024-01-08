import Link from "next/link";
import Button from "src/components/Button";
import Heading from "src/components/Heading";
import styles from "./ErrorPage.module.css";

export interface Props {
  type: "404" | "500";
}

const ErrorPage = ({ type }: Props) => (
  <div className={styles.container}>
    <h1 className={styles.title}>{type}</h1>
    <Heading level="h2" variant="secondary">
      {type === "404" ? "Ooooooooooooooops!" : "Something went wrong..."}
    </Heading>
    <div className={styles.button}>
      <Link href="/">
        <Button variant="primary">Go Home</Button>
      </Link>
    </div>
  </div>
);

export default ErrorPage;
