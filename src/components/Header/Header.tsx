import React, {FC, useMemo} from 'react';
import {Link, useLocation} from 'react-router-dom';

import styles from './Header.module.scss';

interface IMenuItem {
  title: string;
  href: string;
}

interface HeaderProps {
  items: IMenuItem[];
  title: string;
}

export const Header: FC<HeaderProps> = ({items, title}) => {
  const location = useLocation();
  const preparedItems = useMemo(() => {
    return items.map(it => {
      return {...it, active: location.pathname?.includes(it.href)};
    });
  }, [items, location.pathname]);

  return (
    <div className={styles.root}>
      <div className={styles.logo}>{title}</div>
      <div className={styles.menu}>
        {preparedItems.map(it => (
          <Link key={it.href} to={it.href} className={`${styles.item} ${it.active ? styles.itemActive : ''}`}>
            {it.title}
          </Link>
        ))}
      </div>
    </div>
  );
};
