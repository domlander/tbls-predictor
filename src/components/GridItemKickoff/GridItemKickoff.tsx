import styled from "styled-components";
import pageSizes from "src/styles/pageSizes";

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

  font-size: 1.6em;
  @media (max-width: ${pageSizes.tablet}) {
    font-size: 1em;
  }
  @media (max-width: ${pageSizes.mobileM}) {
    font-size: 0.9em;
  }
`;

export default GridItemKickoff;
