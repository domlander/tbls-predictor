import React, { ChangeEvent } from "react";
import styled from "styled-components";
import colours from "../../../styles/colours";

// TODO: standardise height. Make width a choice between small | medium | large
interface StyleProps {
  height?: string;
  width?: string;
}

type Props = StyleProps & {
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  type?: string;
  pattern?: string;
};

const FormInput = ({
  placeholder,
  value,
  width,
  height,
  onChange,
  maxLength,
  type = "text",
  pattern,
}: Props) => (
  <FormInputStyles
    type={type}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
    width={width}
    height={height}
    maxLength={maxLength}
    pattern={pattern}
  />
);

const FormInputStyles = styled.input<StyleProps>`
  background-color: ${colours.grey200};
  color: ${colours.black500};
  border-radius: 0.2em;
  height: ${({ height }) => height || "3.5em"};
  font-size: 1.6em;
  border: 0;
  padding-left: 1em;
  width: ${({ width }) => width || "10em"};
  :placeholder {
    color: ${colours.grey500};
  }
  :hover,
  :focus {
    outline: none;
    border: 0.1em solid ${colours.grey300};
    width: calc(${({ width }) => width || "10em"} - 0.1em);
    height: calc(${({ height }) => height || "10em"} - 0.2em);
    padding-left: 0.9em;
  }
`;

export default FormInput;
