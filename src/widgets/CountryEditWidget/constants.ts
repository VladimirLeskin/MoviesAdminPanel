import {EFieldInfoType, getMultiFieldInfo, IStructFieldInfo} from '../../entries/FieldInfo';
import {ICountry} from './types';
import {EnumField, StringField, StructField} from '../../components/itemEditorFields';
import {Section1HorizontalLayout} from '../../components/layouts/Section1HorizontalLayout';
import {TItemSchema} from '../../entries/BaseEntity';

const namesFieldInfo: IStructFieldInfo<ICountry['names'][0]> = {
  type: EFieldInfoType.STRUCT,
  title: 'Названия',
  renderer: StructField,
  layout: {layoutType: Section1HorizontalLayout},
  subFields: {
    lang: {
      title: 'Язык',
      type: EFieldInfoType.ENUM,
      renderer: EnumField,
      isClearable: false,
      options: [
        {label: 'Русский', value: 'ru'},
        {label: 'English', value: 'en'},
      ],
    },
    name: {title: 'Название', renderer: StringField},
  },
};

export const schema: TItemSchema<ICountry> = {
  id: {title: 'Код', renderer: StringField},
  names: getMultiFieldInfo(namesFieldInfo, {name: '', lang: 'ru'}),
};
