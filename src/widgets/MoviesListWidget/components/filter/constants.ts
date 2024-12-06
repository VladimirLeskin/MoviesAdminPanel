import {makeAutoObservable} from 'mobx';
import {TItemSchema} from 'src/entries/BaseEntity';
import {IMovieFilter} from './MoviesListFilter';
import {EFieldInfoType} from 'src/entries/FieldInfo';
import {EnumField, MultiEnumField} from 'src/components/itemEditorFields';
import {COUNTRIES} from 'src/models/CountriesModel';
import {MOVIES_GENRES} from 'src/models/MoviesGenres';

export const schema = makeAutoObservable({
  get value(): TItemSchema<Pick<IMovieFilter, 'tvSeries' | 'genres' | 'countries' | 'status'>> {
    return {
      status: {
        type: EFieldInfoType.ENUM,
        title: 'Статус',
        renderer: EnumField,
        isClearable: true,
        options: [
          {value: 'ACTIVE', label: 'Активно'},
          {value: 'MODERATION', label: 'Модерация'},
        ],
      },
      tvSeries: {
        type: EFieldInfoType.ENUM,
        title: 'Тип',
        isClearable: true,
        renderer: EnumField,
        options: [
          {value: false, label: 'Фильмы'},
          {value: true, label: 'Сериалы'},
        ],
      },
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
    };
  },
});
