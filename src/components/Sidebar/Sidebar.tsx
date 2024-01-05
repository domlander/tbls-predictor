import { signOut } from "next-auth/react";
import SidebarHeader from "../SidebarHeader";
import SidebarMenuItem from "../SidebarMenuItem";
import styles from "./Sidebar.module.css";

export type Props = {
  username: string;
  isLoggedIn: boolean;
  isLoading: boolean;
  handleClick: () => void; // TODO this closes the sidebar. Can we use global state for this?
};

const Sidebar = ({ username, isLoggedIn, isLoading, handleClick }: Props) => {
  return (
    <div className={styles.container}>
      <SidebarHeader
        username={username}
        isLoading={isLoading}
        handleClick={handleClick}
      />
      <ul className={styles.sidebarItemsContainer}>
        <SidebarMenuItem onClick={handleClick} label="Home" url="/" />
        <SidebarMenuItem
          onClick={handleClick}
          label="My Predictions"
          url="/predictions"
        />
        <SidebarMenuItem
          onClick={handleClick}
          label="My Leagues"
          url="/leagues"
        />
        {isLoggedIn ? (
          <>
            <SidebarMenuItem
              onClick={handleClick}
              label="Join League"
              url="/league/join"
            />
            <SidebarMenuItem
              onClick={handleClick}
              label="Create League"
              url="/league/create"
            />
            <SidebarMenuItem
              onClick={handleClick}
              label="Premier League Table"
              url="/premierleague"
            />
            <SidebarMenuItem
              onClick={handleClick}
              label="My Predicted League Table"
              url="/predictedtable"
            />
            <SidebarMenuItem
              onClick={handleClick}
              label="Account"
              url="/account"
            />
            <SidebarMenuItem onClick={signOut} label="Sign out" url="/signIn" />
          </>
        ) : (
          <SidebarMenuItem onClick={handleClick} label="Sign In" url="/" />
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
