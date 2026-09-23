import React, {FC, useEffect, useMemo, useState} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {IconButton} from '@mui/material';
import {Close, Menu} from '@mui/icons-material';

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
  const [menuOpen, setMenuOpen] = useState(false);

  const preparedItems = useMemo(() => {
    const pathname = location.pathname ?? '';
    const activeHref = items
      .filter(({href}) => pathname === href || pathname.startsWith(`${href}/`))
      .sort((a, b) => b.href.length - a.href.length)[0]?.href;

    return items.map(it => ({
      ...it,
      active: it.href === activeHref,
    }));
  }, [items, location.pathname]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className={styles.root}>
      <div className={styles.logo}>{title}</div>
      <IconButton
        sx={{display: {xs: 'inline-flex', md: 'none'}, marginLeft: 'auto', color: '#212121'}}
        aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen(open => !open)}
      >
        {menuOpen ? <Close /> : <Menu />}
      </IconButton>
      <nav className={`${styles.menu} ${menuOpen ? styles.menuOpen : ''}`} aria-label="Разделы">
        {preparedItems.map(it => (
          <Link key={it.href} to={it.href} className={`${styles.item} ${it.active ? styles.itemActive : ''}`}>
            {it.title}
          </Link>
        ))}
      </nav>
    </div>
  );
};
