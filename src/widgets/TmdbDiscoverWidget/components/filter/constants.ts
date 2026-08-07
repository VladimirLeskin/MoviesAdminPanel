import {makeAutoObservable} from 'mobx';
import {TItemSchema} from 'src/entries/BaseEntity';
import {EFieldInfoType} from 'src/entries/FieldInfo';
import {EnumField, MultiEnumField, NumericField, StringField} from 'src/components/itemEditorFields';
import {COUNTRIES} from 'src/models/CountriesModel';
import {MOVIES_GENRES} from 'src/models/MoviesGenres';

import {ITmdbDiscoverWidgetFilter} from '../../types';

export const schema = makeAutoObservable({
  get value(): TItemSchema<ITmdbDiscoverWidgetFilter> {
    return {
      type: {
        type: EFieldInfoType.ENUM,
        title: 'Тип',
        isClearable: true,
        renderer: EnumField,
        options: [
          {value: 'movie', label: 'Фильмы'},
          {value: 'tv', label: 'Сериалы'},
        ],
      },
      popularity: {
        title: 'Popularity от',
        renderer: NumericField,
        placeholder: 'Минимальное значение',
      },
      date_from: {
        title: 'Дата от',
        renderer: StringField,
        placeholder: 'yyyy-MM-dd',
      },
      date_to: {
        title: 'Дата до',
        renderer: StringField,
        placeholder: 'yyyy-MM-dd',
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
        options: Object.values(MOVIES_GENRES.genres).map(g => ({value: g.id, label: g.name})),
      },
    };
  },
});
