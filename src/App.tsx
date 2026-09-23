import React, {FC, Suspense} from 'react';
import {Route, Routes} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import {observer} from 'mobx-react';
import {ToastContainer} from 'react-toastify';
import {QueryParamProvider} from 'use-query-params';
import {ReactRouter6Adapter} from 'use-query-params/adapters/react-router-6';

import {Header} from './components/Header/Header';
import {ROUTES} from './constants';
import {authModel} from './models/AuthModel';
import {LoginForm} from './components/LoginForm/LoginForm';
import {EUserPermissions, EUserRoles} from './api/Auth';

import 'react-toastify/dist/ReactToastify.css';
import css from './App.module.scss';

const LevelsListPage = React.lazy(() => import('./pages/LevelsListPage').then(m => ({default: m.LevelsListPage})));
const MovieEditPage = React.lazy(() => import('./pages/MovieEditPage').then(m => ({default: m.MovieEditPage})));
const LevelEditPage = React.lazy(() => import('./pages/LevelEditPage').then(m => ({default: m.LevelEditPage})));
const MoviesListPage = React.lazy(() => import('./pages/MoviesListPage').then(m => ({default: m.MoviesListPage})));
const MoviesTmdbImportPage = React.lazy(() =>
  import('./pages/MoviesTmdbImportPage').then(m => ({default: m.MoviesTmdbImportPage}))
);
const CountriesListPage = React.lazy(() =>
  import('./pages/CountriesListPage').then(m => ({default: m.CountriesListPage}))
);
const UsersListPage = React.lazy(() => import('./pages/UsersListPage').then(m => ({default: m.UsersListPage})));
const RolesListPage = React.lazy(() => import('./pages/RolesListPage').then(m => ({default: m.RolesListPage})));

const ADMIN_ROLES = [EUserRoles.admin, EUserRoles.operator];

export const App: FC = observer(() => {
  const headerItems = [
    {title: 'Фильмы', href: ROUTES.MOVIES.LIST},
    {title: 'Заполнение БД', href: ROUTES.MOVIES.TMDB_IMPORT},
    {title: 'Уровни', href: ROUTES.LEVELS.LIST},
    {title: 'Страны', href: ROUTES.COUNTRIES.LIST},
    ...(authModel.hasPermission(EUserPermissions.editRoles)
      ? [
          {title: 'Пользователи', href: ROUTES.USERS.LIST},
          {title: 'Роли', href: ROUTES.ROLES.LIST},
        ]
      : []),
  ];

  if (!authModel.login && authModel.isLoading) {
    return <>Загрузка...</>;
  } else if (!authModel.login) {
    return <LoginForm onLogin={authModel.onLogin} />;
  } else if (!ADMIN_ROLES.some(r => !!authModel.roles?.includes(r))) {
    return null;
  }
  return (
    <div className={css.App}>
      <div className={css.ToastContainer}>
        <ToastContainer theme="colored" autoClose={10000} closeButton />
      </div>
      <BrowserRouter basename={`/${process.env.ROUTER_BASENAME}`}>
        <QueryParamProvider adapter={ReactRouter6Adapter} options={{}}>
          <Header title="админка" items={headerItems} />
          <div className={css.Content}>
            <Suspense fallback={<>Загрузка...</>}>
              <Routes>
                <Route path={ROUTES.LEVELS.DETAILS} element={<LevelEditPage />} />
                <Route path={ROUTES.LEVELS.CREATE} element={<LevelEditPage />} />
                <Route path={ROUTES.LEVELS.LIST} element={<LevelsListPage />} />
                <Route path={ROUTES.MOVIES.DETAILS} element={<MovieEditPage />} />
                <Route path={ROUTES.MOVIES.CREATE} element={<MovieEditPage />} />
                <Route path={ROUTES.MOVIES.LIST} element={<MoviesListPage />} />
                <Route path={ROUTES.MOVIES.TMDB_IMPORT} element={<MoviesTmdbImportPage />} />
                <Route path={ROUTES.COUNTRIES.LIST} element={<CountriesListPage />} />
                {authModel.hasPermission(EUserPermissions.editRoles) && (
                  <>
                    <Route path={ROUTES.USERS.LIST} element={<UsersListPage />} />
                    <Route path={ROUTES.ROLES.LIST} element={<RolesListPage />} />
                  </>
                )}
              </Routes>
            </Suspense>
          </div>
        </QueryParamProvider>
      </BrowserRouter>
    </div>
  );
});
