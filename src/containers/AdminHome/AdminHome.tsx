import Link from "next/link";
import Heading from "src/components/Heading";
import styles from "./AdminHome.module.css";

const AdminHome = () => (
  <section>
    <Heading level="h1" variant="secondary">
      Admin
    </Heading>
    <ul>
      <li className={styles.listItem}>
        <Link href="admin/updateResults">Update Results</Link>
      </li>
      <li className={styles.listItem}>
        <Link href="admin/manageFixtures">Manage Fixtures</Link>
      </li>
      <li className={styles.listItem}>
        <Link href="admin/updatePredictions">
          Add/edit predictions (in development)
        </Link>
      </li>
    </ul>
  </section>
);

export default AdminHome;
