import React, {FC} from 'react';
import {Route, Routes} from 'react-router';
import {LevelEditPage} from './pages/LevelEditPage/LevelEditPage';
import {BrowserRouter} from 'react-router-dom';

import css from './App.module.scss';

export const App: FC = () => {
  return (
    <div className={css.App}>
      <BrowserRouter>
        <Routes>
          <Route path="/levels/:levelId" element={<LevelEditPage />} />
          <Route path="/levels/create" element={<LevelEditPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};
