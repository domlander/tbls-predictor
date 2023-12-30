import UserIcon from "src/components/UserIcon";

export interface Props {
  initial: string;
  isLoading: boolean;
  handleClick?: () => void;
}

const HeaderUserIcon = ({ initial, isLoading, handleClick }: Props) => (
  <div>
    {!isLoading ? (
      <UserIcon initial={initial} handleClick={handleClick} />
    ) : null}
  </div>
);

export default HeaderUserIcon;
