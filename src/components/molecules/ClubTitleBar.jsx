// src/components/molecules/ClubTitleBar.jsx
import React from 'react';
import styles from './ClubTitleBar.module.scss';

export default function ClubTitleBar({ clubName = "Mercedes Padel" }) {
  return (
    <div className={styles.titleBar}>
      <h2 className={styles.clubName}>{clubName}</h2>
    </div>
  );
}