import React, { ReactNode } from "react";
import styled from "styled-components";
import colours from "../../styles/colours";

const variants = {
  primary: {
    colour: colours.blackblue500,
    hoverColour: colours.black700,
    disabledColour: colours.blackblue400,
    backgroundColour: colours.cyan200,
    hoverBackgroundColour: colours.cyan50,
  },
  secondary: {
    colour: colours.blackblue400,
    hoverColour: colours.blackblue400,
    disabledColour: colours.blackblue400,
    backgroundColour: colours.grey200,
    hoverBackgroundColour: colours.grey400,
  },
};

interface StyleProps {
  disabled?: boolean;
  variant: "primary" | "secondary";
}

export type Props = StyleProps & {
  children: ReactNode;
  className?: string;
  handleClick?: (e: React.MouseEvent<HTMLElement>) => void;
  id?: string;
  type?: "button" | "submit";
};

const Button = ({
  children,
  className,
  disabled = false,
  handleClick,
  id,
  type = "button",
  variant,
}: Props) => (
  <ButtonStyles
    className={className}
    disabled={disabled}
    id={id}
    onClick={handleClick}
    type={type}
    variant={variant}
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
        : variants[variant].hoverBackgroundColour};
  }

  :focus {
    height: 1.7em;
    width: calc(100% - 0.1em);
    margin-top: 0.05em;
    margin-left: 0.05em;
    background-color: ${({ variant }) =>
      variants[variant].hoverBackgroundColour};
  }
`;

export default Button;
