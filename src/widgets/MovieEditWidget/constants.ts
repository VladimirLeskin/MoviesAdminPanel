import {makeAutoObservable} from 'mobx';
import {TItemSchema} from '../../entries/BaseEntity';
import {IEditedMovieInfo} from './types';
import {
  BooleanField,
  DateField,
  EnumField,
  MultiEnumField,
  NumericField,
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
import {ArrayUtils} from '../../utils/ArrayUtils';
import {ImdbIdField} from './components/ImdbIdField/ImdbIdField';

export const schema = makeAutoObservable({
  get value(): TItemSchema<IEditedMovieInfo> {
    return {
      id: {title: 'ID', disabled: true, renderer: NumericField},
      status: {
        title: 'Статус',
        options: [
          {value: 'ACTIVE', label: 'Активно'},
          {value: 'MODERATION', label: 'Модерация'},
        ],
        renderer: EnumField,
      },
      tv_series: {title: 'Сериал', renderer: BooleanField},
      original_title: {title: 'Оригинальное название', renderer: StringField},
      tmdb_id: {title: 'tmdb_id', renderer: StringField},
      imdb_id: {title: 'imdb_id', renderer: ImdbIdField},
      release_date: {title: 'Дата релиза', renderer: DateField},
      end_date: {title: 'Дата окончания', renderer: DateField},
      countries: {
        type: EFieldInfoType.ENUM_MULTI,
        title: 'Страны',
        renderer: MultiEnumField,
        options: Object.values(COUNTRIES.countries)
          .sort((a, b) => (a.name || a.country_code).localeCompare(b.name || b.country_code))
          .map(c => ({
            value: c.country_code,
            label: c.name || c.country_code,
          })),
      },
      genres: {
        type: EFieldInfoType.ENUM_MULTI,
        title: 'Жанры',
        renderer: MultiEnumField,
        options: Object.values(MOVIES_GENRES.genres)
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(g => ({
            value: g.id,
            label: g.name,
          })),
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

export const getlayoutSettings = (values?: IEditedMovieInfo): ILayoutSettings<IEditedMovieInfo> => ({
  layoutType: Section2Horizontal,
  fieldsBySections: [
    ArrayUtils.removeEmpty([
      'id',
      'status',
      'tv_series',
      'original_title',
      'tmdb_id',
      'imdb_id',
      'release_date',
      values?.tv_series ? 'end_date' : undefined,
      'countries',
      'genres',
      'descriptions',
    ]),
    ['images'],
  ],
});
