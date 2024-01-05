"use client";

import styled from "styled-components";

export type Props = {
  className?: string;
  label: string;
};

const GridItemKickoff = ({ className, label }: Props) => (
  <Kickoff className={className}>{label}</Kickoff>
);

const Kickoff = styled.span`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-left: 4px;

  font-size: 0.9rem;
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
  @media (max-width: 480px) {
    font-size: 0.55rem;
  }
  @media (max-width: 375px) {
    font-size: 0.45rem;
  }
`;

export default GridItemKickoff;
