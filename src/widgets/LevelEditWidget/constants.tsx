import React from 'react';
import {IEditedLevelInfo} from './types';
import {EFieldInfoType, getMultiFieldInfo, IFieldRendererProps, IStructFieldInfo} from '../../entries/FieldInfo';
import {withCollapsibleContent} from '../../components/itemEditorFields/modificators';
import {
  BooleanField,
  EnumField,
  NumericField,
  StringField,
  StructField,
  TextAreaField,
} from '../../components/itemEditorFields';
import {TItemSchema} from '../../entries/BaseEntity';
import {FormControl, FormLabel} from '@mui/material';
import {ImageField} from '../../components/itemEditorFields/ImageField/ImageField';
import {QuestionEdit} from './components/QuestionEdit/QuestionEdit';

type Description = IEditedLevelInfo['descriptions'][0];

const descriptionsFieldInfo: IStructFieldInfo<Description> = {
  title: 'Описания',
  type: EFieldInfoType.STRUCT,
  renderer: withCollapsibleContent<Description, IStructFieldInfo<Description>>(StructField, {
    title: ({value}) => `${[value?.lang, value?.title].filter(Boolean).join(': ')}`,
  }),
  subFields: {
    lang: {
      type: EFieldInfoType.ENUM,
      isClearable: false,
      title: 'Язык',
      renderer: EnumField,
      options: [
        {value: 'ru', label: 'Русский'},
        {value: 'en', label: 'English'},
      ],
    },
    title: {title: 'Название', renderer: StringField},
    description: {title: 'Описание', renderer: TextAreaField},
  },
};

export const schema: TItemSchema<IEditedLevelInfo> = {
  id: {title: 'ID', disabled: true, renderer: NumericField},
  type: {
    title: 'Тип',
    type: EFieldInfoType.ENUM,
    isClearable: false,
    renderer: EnumField,
    options: [
      {value: 'COUNT', label: 'COUNT'},
      {value: 'TIME', label: 'TIME'},
    ],
  },
  isActive: {title: 'Опубликовано', renderer: BooleanField},
  totalTime: {title: 'Общее время', renderer: NumericField},
  timeForEach: {title: 'Время на вопрос', renderer: NumericField},
  descriptions: getMultiFieldInfo(descriptionsFieldInfo, {description: '', title: '', lang: 'ru'}),
  image: {
    title: 'Картинка',
    required: true,
    renderer: (props: IFieldRendererProps<IEditedLevelInfo['image']>) => (
      <FormControl required={props.fieldInfo.required}>
        <FormLabel>{props.fieldInfo.title}</FormLabel>
        <ImageField {...props} />
      </FormControl>
    ),
  },
  questions: getMultiFieldInfo({title: 'Вопросы', renderer: QuestionEdit}, {variants: [], image: {id: 0, path: ''}}),
};
