import React, { ReactNode } from "react";
import styled from "styled-components";

interface StyleProps {
  backgroundColour: string;
  colour: string;
  hoverColour: string;
  width: number;
}

export type Props = StyleProps & {
  handleClick: (e: React.MouseEvent) => void;
  label: ReactNode;
};

const Button = ({
  handleClick,
  backgroundColour,
  hoverColour,
  label,
  colour,
  width,
}: Props) => (
  <ButtonStyles
    backgroundColour={backgroundColour}
    colour={colour}
    hoverColour={hoverColour}
    onClick={handleClick}
    type="button"
    width={width}
  >
    {label}
  </ButtonStyles>
);

const ButtonStyles = styled.button<StyleProps>`
  background-color: ${({ backgroundColour }) => backgroundColour};
  border-radius: 0.1em;
  border: 0;
  color: ${({ colour }) => colour};
  cursor: pointer;
  font-size: 2.4em;
  height: 1.6em;
  width: ${({ width }) => `${width}em`};
  :focus {
    outline: none;
    border: 0.05em solid ${({ hoverColour }) => hoverColour};
  }
  :hover {
    border: 0.05em solid ${({ hoverColour }) => hoverColour};
  }
  :active {
    height: 1.5em;
    width: ${({ width }) => `${width - 0.1}em`};
    margin-top: 0.05em;
    margin-left: 0.05em;
    background-color: ${({ hoverColour }) => hoverColour};
  }
`;

export default Button;
