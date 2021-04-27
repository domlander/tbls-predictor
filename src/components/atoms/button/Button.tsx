import React, { ReactNode } from "react";
import styled from "styled-components";

interface StyleProps {
  backgroundColour: string;
  colour: string;
  hoverColour: string;
}

export type Props = StyleProps & {
  handleClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: ReactNode;
  type?: "button" | "submit";
  className?: string;
};

const Button = ({
  backgroundColour,
  hoverColour,
  children,
  className,
  colour,
  handleClick,
  type = "button",
}: Props) => (
  <ButtonStyles
    backgroundColour={backgroundColour}
    colour={colour}
    hoverColour={hoverColour}
    onClick={handleClick}
    type={type}
    className={className}
  >
    {children}
  </ButtonStyles>
);

const ButtonStyles = styled.button<StyleProps>`
  background-color: ${({ backgroundColour }) => backgroundColour};
  border-radius: 0.1em;
  border: 0;
  color: ${({ colour }) => colour};
  cursor: pointer;
  font-size: 2.4em;
  height: 1.8em;
  width: 100%;
  :focus,
  :hover {
    outline: none;
    border: 0.05em solid ${({ hoverColour }) => hoverColour};
  }
  :active {
    height: 1.7em;
    width: calc(100% - 0.1em);
    margin-top: 0.05em;
    margin-left: 0.05em;
    background-color: ${({ hoverColour }) => hoverColour};
  }
`;

export default Button;
