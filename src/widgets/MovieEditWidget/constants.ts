import {makeAutoObservable} from 'mobx';
import {TItemSchema} from '../../entries/BaseEntity';
import {IEditedMovieInfo} from './types';
import {
  DateField,
  EnumField,
  MultiEnumField,
  StringField,
  StructField,
  TextAreaField,
} from '../../components/itemEditorFields';
import {EFieldInfoType, getMultiFieldInfo, ILayoutSettings, IStructFieldInfo} from '../../entries/FieldInfo';
import {COUNTRIES} from '../../models/CountriesModel';
import {MOVIES_GENRES} from '../../models/MoviesGenres';
import {withCollapsibleContent} from '../../components/itemEditorFields/modificators';
import {ImageField} from '../../components/itemEditorFields/ImageField/ImageField';
import {Section2Horizontal} from '../../components/layouts/Section2Horizontal';

export const schema: {value: TItemSchema<IEditedMovieInfo>} = makeAutoObservable({
  get value(): TItemSchema<IEditedMovieInfo> {
    return {
      id: {title: 'ID', disabled: true, renderer: StringField},
      original_title: {title: 'Оригинальное название', renderer: StringField},
      tmdb_id: {title: 'tmdb_id', renderer: StringField},
      imdb_id: {title: 'imdb_id', renderer: StringField},
      release_date: {title: 'Дата релиза', renderer: DateField},
      countries: {
        type: EFieldInfoType.ENUM_MULTI,
        title: 'Страны',
        renderer: MultiEnumField,
        options: Object.values(COUNTRIES.countries).map(c => ({
          value: c.country_code,
          label: c.name || c.country_code,
        })),
      },
      genres: {
        type: EFieldInfoType.ENUM_MULTI,
        title: 'Жанры',
        renderer: MultiEnumField,
        options: Object.values(MOVIES_GENRES.genres).map(g => ({value: g.genre_id, label: g.name})),
      },
      descriptions: getMultiFieldInfo(
        {
          title: 'Описания',
          type: EFieldInfoType.STRUCT,
          renderer: withCollapsibleContent(
            StructField as IStructFieldInfo<IEditedMovieInfo['descriptions'][0]>['renderer'],
            {title: ({value}) => `${[value?.lang, value?.title].filter(Boolean).join(': ')}`}
          ),
          subFields: {
            lang: {
              type: EFieldInfoType.ENUM,
              title: 'Язык',
              renderer: EnumField,
              options: [
                {value: 'ru', label: 'Русский'},
                {value: 'en', label: 'English'},
              ],
            },
            title: {title: 'Название', renderer: StringField},
            description: {title: 'Описание', renderer: TextAreaField},
            tagline: {title: 'Слоган', renderer: StringField},
          },
        } as IStructFieldInfo<IEditedMovieInfo['descriptions'][0]>,
        {lang: 'en', title: '', tagline: '', description: ''}
      ),
      images: getMultiFieldInfo(
        {
          title: 'Картинки',
          renderer: ImageField,
        },
        {}
      ),
    };
  },
});

export const layoutSettings: ILayoutSettings<IEditedMovieInfo> = {
  layoutType: Section2Horizontal,
  fieldsBySections: [
    ['id', 'original_title', 'tmdb_id', 'imdb_id', 'release_date', 'countries', 'genres', 'descriptions'],
    ['images'],
  ],
};
