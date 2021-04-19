import React, { ReactNode } from "react";
import styled from "styled-components";

interface FunctionalProps {
  handleClick: () => void;
  children?: ReactNode;
}

interface StyleProps {
  height: number;
  width: number;
  backgroundColour: string;
  borderRadius: number;
}

export type ButtonProps = FunctionalProps & StyleProps;

const Button = ({
  handleClick,
  width,
  height,
  backgroundColour,
  borderRadius,
  children,
}: ButtonProps) => (
  <ButtonStyles
    type="button"
    onClick={handleClick}
    width={width}
    height={height}
    backgroundColour={backgroundColour}
    borderRadius={borderRadius}
  >
    {children}
  </ButtonStyles>
);

const ButtonStyles = styled.button<StyleProps>`
  width: ${({ width }) => `${width}px`};
  height: ${({ height }) => `${height}px`};
  background-color: ${({ backgroundColour }) => backgroundColour};
  border-radius: ${({ borderRadius }) => borderRadius};
  border: 0;
  cursor: pointer;
`;

export default Button;
