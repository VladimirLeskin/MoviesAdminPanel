import React, {FC, ImgHTMLAttributes} from 'react';
import Config from '../../entries/Config';

type Props = ImgHTMLAttributes<HTMLImageElement>;

export const Image: FC<Props> = props => {
  const {src, ...other} = props;
  return <img src={[Config.imagesUrl, src].join('/')} {...other} />;
};
