"use client";

import { ChangeEvent } from "react";
import styled from "styled-components";

type Props = {
  placeholder?: string;
  name?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  minLength?: number;
  maxLength?: number;
  type?: string;
  pattern?: string;
};

const FormInput = ({
  placeholder,
  name,
  value,
  onChange,
  minLength,
  maxLength,
  type = "text",
  pattern,
}: Props) => (
  <Input
    type={type}
    name={name}
    value={value}
    placeholder={placeholder}
    onChange={onChange}
    minLength={minLength}
    maxLength={maxLength}
    pattern={pattern}
  />
);

const Input = styled.input`
  height: 2.4em;
  width: 12em;
  background-color: var(--grey200);
  color: var(--black100);
  border-radius: 0.2em;
  font-size: 1.6em;
  border: 0;
  padding-left: 1em;

  &:placeholder {
    color: var(--grey500);
  }

  &:hover,
  &:focus {
    height: 2.2em;
    width: 11.9em;
    outline: none;
    border: 0.1em solid var(--grey300);
    padding-left: 0.9em;
  }
`;

export default FormInput;
