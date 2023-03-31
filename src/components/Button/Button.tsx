import { ReactNode } from "react";
import styled from "styled-components";
import colours from "src/styles/colours";

const variants = {
  primary: {
    colour: colours.black700,
    disabledColour: colours.blackblue400,
    backgroundColour: colours.cyan300,
    hoverBackgroundColour: colours.cyan100,
    border: 0,
    borderRadius: "0.1em",
  },
  secondary: {
    colour: colours.grey300,
    disabledColour: colours.blackblue400,
    backgroundColour: colours.blackblue400,
    hoverBackgroundColour: colours.blackblue300,
    border: `1px solid ${colours.grey300}`,
    borderRadius: "0.4em",
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
  border-radius: ${({ variant }) => variants[variant].borderRadius};
  border: ${({ variant }) => variants[variant].border};
  color: ${({ disabled, variant }) =>
    disabled ? variants[variant].disabledColour : variants[variant].colour};
  cursor: pointer;
  font-size: 1.6rem;
  height: 1.8em;
  opacity: ${({ disabled }) => (disabled ? "50%" : "100%")};
  padding: 0 1em;
  width: 100%;
  :hover {
    outline: none;
    background-color: ${({ disabled, variant }) =>
      disabled
        ? variants[variant].backgroundColour
        : variants[variant].hoverBackgroundColour};
  }

  :focus {
    background-color: ${({ variant }) =>
      variants[variant].hoverBackgroundColour};
  }
`;

export default Button;
