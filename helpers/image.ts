const createImage = (url: string): HTMLImageElement => {
  const image = new Image();
  image.src = url;
  return image;
};
export default createImage;
