import * as React from "react";
import * as PropTypes from "prop-types";
import styled from "styled-components";
import ImageWithFallback from "./ImageWithFallback";
import user from "../assets/user.png";

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
  width: ${({ size }) => `${size / 1.5}px`};
  height: ${({ size }) => `${size / 1.5}px`};
`;

const SProfileName = styled.h2<IProfileCardStyleProps>`
  text-transform: uppercase;
  font-size: ${({ size }) => `${size / 1.875}px`};
  margin: ${({ size }) =>
    `${size / 11.25}px 0px ${size / 11.25}px ${size / 4.5}px`};
`;

const SProfileDetails = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProfileCard = (props: any) => {
  const { name, size } = props;
  return (
    <SProfileCard>
      <SProfileLogo size={size} src={user} alt="Logo" />
      <SProfileDetails>
        <SProfileName size={size}>{name || `Profile`}</SProfileName>
      </SProfileDetails>
    </SProfileCard>
  );
};

ProfileCard.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number
};

ProfileCard.defaultProps = {
  size: 45
};

export default ProfileCard;
