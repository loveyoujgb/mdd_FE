import React from "react";
import styled from "styled-components";

const Skeleton = () => {
  return (
    <StSkeleton>
      <StShimmerContainer>
        <StShimmer />
      </StShimmerContainer>
    </StSkeleton>
  );
};

export default Skeleton;

const StSkeleton = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.gray};
  position: relative;
`;

const StShimmerContainer = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  animation: loading 2.5s infinite;
  @keyframes loading {
    0% {
      transform: translateX(-150%);
    }
    50% {
      transform: translateX(-60%);
    }
    100% {
      transform: translate(150%);
    }
  }
`;

const StShimmer = styled.div`
  width: 70%;
  height: 100%;
  /* background-color: rgba(255, 255, 255, 0.2); */
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 25%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0.4) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  box-shadow: 0 0 30px 30px rgba(255, 255, 255, 0.05);
`;
