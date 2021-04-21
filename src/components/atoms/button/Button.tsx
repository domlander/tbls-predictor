import React, { ReactNode } from "react";
import styled from "styled-components";

interface FunctionalProps {
  handleClick: () => void;
  label: ReactNode;
}

interface StyleProps {
  backgroundColour: string;
  borderRadius: number;
  colour: string;
  height: number;
  width: number;
}

export type ButtonProps = FunctionalProps & StyleProps;

const Button = ({
  handleClick,
  backgroundColour,
  borderRadius,
  label,
  colour,
  height,
  width,
}: ButtonProps) => (
  <ButtonStyles
    backgroundColour={backgroundColour}
    borderRadius={borderRadius}
    colour={colour}
    height={height}
    onClick={handleClick}
    type="button"
    width={width}
  >
    {label}
  </ButtonStyles>
);

const ButtonStyles = styled.button<StyleProps>`
  background-color: ${({ backgroundColour }) => backgroundColour};
  border-radius: ${({ borderRadius }) => `${borderRadius}px`};
  border: 0;
  color: ${({ colour }) => colour};
  cursor: pointer;
  font-size: 24px;
  height: ${({ height }) => `${height}px`};
  width: ${({ width }) => `${width}px`};
`;

export default Button;
