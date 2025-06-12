import React from 'react';

import styles from './field.module.css';

export function ObjectId({ objectId }: { objectId: string }) {
  return <div className={styles.objectId}>ID: {objectId}</div>;
}
