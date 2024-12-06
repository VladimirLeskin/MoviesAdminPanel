import React, {FC, ImgHTMLAttributes, ReactEventHandler, useCallback, useState} from 'react';
import Config from '../../entries/Config';

import css from './Image.module.scss';

type Props = ImgHTMLAttributes<HTMLImageElement>;

export const Image: FC<Props> = props => {
  const {src, ...other} = props;
  const [sizes, setSizes] = useState<number[] | undefined>(undefined);

  const handleLoad: ReactEventHandler<HTMLImageElement> = useCallback(e => {
    const imgElm = e.target as HTMLImageElement;
    if (imgElm?.naturalWidth && imgElm?.naturalHeight) {
      setSizes([imgElm.naturalWidth && imgElm.naturalHeight]);
    }
  }, []);

  return (
    <div className={css.root}>
      <img onLoad={handleLoad} src={[Config.imagesUrl, src].join('/')} {...other}></img>
      <span className={css.sizes}>
        {sizes?.[0]}x{sizes?.[1]}
      </span>
    </div>
  );
};
