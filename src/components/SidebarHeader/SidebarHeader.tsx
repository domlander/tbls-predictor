import Image from "next/image";
import cross from "public/images/Cross.svg";
import UserIcon from "src/components/UserIcon";
import styles from "./SidebarHeader.module.css";
import { chivoMono } from "app/fonts";

const MAX_USERNAME_LENGTH = 16;

export interface Props {
  username: string;
  isLoading: boolean;
  handleClick: () => void;
}

const SidebarHeader = ({ username, isLoading, handleClick }: Props) => (
  <div className={styles.container}>
    {!isLoading ? (
      <div className={styles.user}>
        <UserIcon initial={username ? username[0].toUpperCase() : ""} />
        <p className={[chivoMono.className, styles.username].join(" ")}>
          {username.length > MAX_USERNAME_LENGTH
            ? `${username.substring(0, MAX_USERNAME_LENGTH - 2)}...`
            : username}
        </p>
      </div>
    ) : (
      // Ensure that flex positioning still works correctly
      <div />
    )}
    <div className={styles.crossIcon} tabIndex={0} onClick={handleClick}>
      <Image src={cross} alt="close sidebar cross" />
    </div>
  </div>
);

export default SidebarHeader;
