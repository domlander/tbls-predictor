import styled from "styled-components";
import Image from "next/image";
import cross from "public/images/Cross.svg";
import UserIcon from "src/components/UserIcon";
import colours from "src/styles/colours";

const MAX_USERNAME_LENGTH = 16;

export interface Props {
  username: string;
  isLoading: boolean;
  handleClick: () => void;
}

const SidebarHeader = ({ username, isLoading, handleClick }: Props) => (
  <Container>
    {!isLoading ? (
      <User>
        <UserIcon initial={username ? username[0].toUpperCase() : ""} />
        <Username>
          {username.length > MAX_USERNAME_LENGTH
            ? `${username.substring(0, MAX_USERNAME_LENGTH - 2)}...`
            : username}
        </Username>
      </User>
    ) : (
      // Ensure that flex positioning still works correctly
      <div />
    )}
    <ImageContainer tabIndex={0} onClick={handleClick}>
      <Image src={cross} alt="close sidebar cross" />
    </ImageContainer>
  </Container>
);

const Container = styled.div`
  width: 100%;
  height: 5em;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: ${colours.blackblue450};
`;

const User = styled.div`
  display: flex;
  align-items: center;
  padding-left: 1.6em;
`;

const Username = styled.p`
  margin-left: 1.2em;
  color: ${colours.grey200};
  font-size: 1.4em; // TODO: use font with consistent letter box-sizing, so we know how many letters to allow
  font-weight: 400;
`;

const ImageContainer = styled.div`
  margin-right: 1.6em;
  display: flex;
  align-items: center;
  cursor: pointer;

  &:focus,
  &:hover {
    outline: 1px solid ${colours.grey100};
  }
`;

export default SidebarHeader;
