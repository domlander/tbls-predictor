import Heading from "src/components/Heading";
import ChangeUsernameForm from "src/components/ChangeUsernameForm";

type Props = {
  username: string;
};

const AccountContainer = ({ username }: Props) => {
  return (
    <>
      <Heading level="h1">Account</Heading>
      <ChangeUsernameForm initialUsername={username} />
    </>
  );
};

export default AccountContainer;
