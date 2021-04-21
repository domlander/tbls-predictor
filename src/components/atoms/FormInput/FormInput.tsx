import React from "react";
import styled from "styled-components";
import colours from "../../../styles/colours";

interface Props {
  placeholder?: string;
}

const FormInput = ({ placeholder }: Props) => (
  <FormInputStyles type="text" placeholder={placeholder} />
);

const FormInputStyles = styled.input`
  background-color: ${colours.grey200};
  color: ${colours.black500};
  border-radius: 0.2em;
  height: 3.5em;
  font-size: 1.6em;
  border: 0;
  padding-left: 1em;
  ::placeholder {
    color: ${colours.grey500};
  }
  :hover,
  :focus {
    outline: none;
    border: 0.1em solid ${colours.grey300};
    height: 3.3em;
    padding-left: 0.9em;
  }
`;

export default FormInput;
