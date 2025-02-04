import { useState, useEffect } from "react";
import styled from "styled-components";
import Skeleton from "./Skeleton";

interface ImageLoaderProps {
  src: string;
}

const ImageLoader = ({ src }: ImageLoaderProps) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const image = new Image();
    image.onload = () => setLoading(false);
    image.src = src;
  }, [src]);

  if (loading) {
    return <Skeleton />;
  } else {
    return <StImg src={src} alt="loaded preview" />;
  }
};

export default ImageLoader;

const StImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
