import React, {FC} from 'react';
import {Route, Routes} from 'react-router';
import {BrowserRouter} from 'react-router-dom';

import {LevelEditPage} from './pages/LevelEditPage/LevelEditPage';
import {MovieEditPage} from './pages/MovieEditPage/MovieEditPage';
import {Header} from './components/Header/Header';
import {ROUTES} from './constants';
import {MoviePicker} from './widgets/MoviesPicker/MoviePicker';
import {LevelsListPage} from './pages/LevelsListPage/LevelsListPage';

import css from './App.module.scss';
import {observer} from 'mobx-react';
import {AuthModel} from './models/AuthModel';
import {LoginForm} from './components/LoginForm/LoginForm';

const HEADER_ITEMS = [
  {title: 'Фильмы', href: ROUTES.MOVIES.LIST},
  {title: 'Уровни', href: ROUTES.LEVELS.LIST},
];

const authModel = new AuthModel();

export const App: FC = observer(() => {
  if (!authModel.login || authModel.isLoading) {
    if (authModel.isLoading) {
      return <>Загрузка...</>;
    }
    return <LoginForm onLogin={authModel.onLogin} />;
  }
  return (
    <div className={css.App}>
      <BrowserRouter>
        <Header title="админка" items={HEADER_ITEMS} />
        <div className={css.Content}>
          <Routes>
            <Route path={ROUTES.LEVELS.DETAILS} element={<LevelEditPage />} />
            <Route path={ROUTES.LEVELS.CREATE} element={<LevelEditPage />} />
            <Route path={ROUTES.LEVELS.LIST} element={<LevelsListPage />} />
            <Route path={ROUTES.MOVIES.DETAILS} element={<MovieEditPage />} />
            <Route path={ROUTES.MOVIES.CREATE} element={<MovieEditPage />} />
            <Route
              path={ROUTES.MOVIES.LIST}
              element={<MoviePicker onSelectImage={() => 1} onSelectMovie={() => 1} />}
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
});
