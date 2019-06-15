import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import ImageWithFallback from "./ImageWithFallback";
import user from "../assets/user.png";
import { ellipseText } from "src/helpers/utilities";

interface IProfileCardStyleProps {
  size: number;
}

const SProfileCard = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const SProfileLogo = styled(ImageWithFallback)<IProfileCardStyleProps>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
`;

const SProfileName = styled.h2<IProfileCardStyleProps>`
  font-size: ${({ size }) => `${size / 2.5}px`};
  margin: ${({ size }) => `0 0 ${size / 11.25}px ${size / 4.5}px`};
`;

const SProfileDetails = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SProfileAddress = styled.p<IProfileCardStyleProps>`
  width: 100%;
  line-height: ${({ size }) => `${size / 37.5}`};
  font-size: ${({ size }) => `${size / 3.214}px`};
  padding: 0;
  margin: 0;
  margin-left: ${({ size }) => `${size / 4.5}px`};
`;

const ProfileCard = (props: any) => {
  const { name, address, size } = props;
  return (
    <SProfileCard>
      <SProfileLogo size={size} src={user} alt="Logo" />
      <SProfileDetails>
        <SProfileName size={size}>{name}</SProfileName>
        <SProfileAddress size={size}>{ellipseText(address)}</SProfileAddress>
      </SProfileDetails>
    </SProfileCard>
  );
};

ProfileCard.propTypes = {
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  size: PropTypes.number
};

ProfileCard.defaultProps = {
  size: 45
};

export default ProfileCard;
