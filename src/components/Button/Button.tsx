import React, { ReactNode } from "react";
import styled from "styled-components";
import colours from "../../styles/colours";

const variants = {
  primary: {
    backgroundColour: colours.blue100,
    hoverColour: colours.cyan500,
    colour: colours.blackblue500,
    disabledColour: colours.blackblue400,
  },
  secondary: {
    backgroundColour: colours.grey200,
    hoverColour: colours.grey400,
    colour: colours.blackblue400,
    disabledColour: colours.blackblue400,
  },
};

interface StyleProps {
  disabled?: boolean;
  variant: "primary" | "secondary";
}

export type Props = StyleProps & {
  handleClick?: (e: React.MouseEvent<HTMLElement>) => void;
  children: ReactNode;
  type?: "button" | "submit";
  className?: string;
};

const Button = ({
  variant,
  children,
  className,
  disabled = false,
  handleClick,
  type = "button",
}: Props) => (
  <ButtonStyles
    variant={variant}
    className={className}
    disabled={disabled}
    onClick={handleClick}
    type={type}
  >
    {children}
  </ButtonStyles>
);

const ButtonStyles = styled.button<StyleProps>`
  background-color: ${({ variant }) => variants[variant].backgroundColour};
  border-radius: 0.1em;
  border: 0;
  color: ${({ disabled, variant }) =>
    disabled ? variants[variant].disabledColour : variants[variant].colour};
  cursor: pointer;
  font-size: 1.6rem;
  height: 1.8em;
  opacity: ${({ disabled }) => (disabled ? "50%" : "100%")};
  width: 100%;
  :hover {
    outline: none;
    background-color: ${({ disabled, variant }) =>
      disabled
        ? variants[variant].backgroundColour
        : variants[variant].hoverColour};
  }

  :focus {
    height: 1.7em;
    width: calc(100% - 0.1em);
    margin-top: 0.05em;
    margin-left: 0.05em;
    background-color: ${({ variant }) => variants[variant].hoverColour};
  }
`;

export default Button;
