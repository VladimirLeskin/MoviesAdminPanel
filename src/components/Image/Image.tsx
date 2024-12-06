import React, {FC, ImgHTMLAttributes, useLayoutEffect, useRef, useState} from 'react';
import Config from '../../entries/Config';

import css from './Image.module.scss';

type Props = ImgHTMLAttributes<HTMLImageElement>;

export const Image: FC<Props> = props => {
  const {src, ...other} = props;
  const ref = useRef<HTMLImageElement>(null);
  const [sizes, setSizes] = useState<number[] | undefined>(undefined);

  useLayoutEffect(() => {
    if (ref.current?.naturalWidth && ref.current?.naturalHeight) {
      setSizes([ref.current.naturalWidth, ref.current.naturalHeight]);
    }
  }, []);

  return (
    <div className={css.root}>
      <img ref={ref} src={[Config.imagesUrl, src].join('/')} {...other}></img>
      <span className={css.sizes}>
        {sizes?.[0]}x{sizes?.[1]}
      </span>
    </div>
  );
};
