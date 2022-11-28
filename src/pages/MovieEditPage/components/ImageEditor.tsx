import React, {FC, useCallback} from 'react';
import {ImageUpload} from 'src/components/ImageUpload/ImageUpload';

interface IImageInfo {
  id?: string;
  src?: string;
  content?: string;
}

interface ImageEditorProps {
  imgInfo: IImageInfo;
  onChange: (img: IImageInfo) => void;
}

export const ImageEditor: FC<ImageEditorProps> = ({imgInfo, onChange}) => {
  const onImageChanged = useCallback(
    content => {
      onChange({...imgInfo, content});
    },
    [imgInfo, onChange]
  );

  return (
    <div>
      <ImageUpload src={imgInfo.content || imgInfo.src} onChange={onImageChanged} />
    </div>
  );
};
