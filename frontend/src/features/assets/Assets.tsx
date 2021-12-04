import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import {
  selectOpenRakutenTable,
  selectRakutenHistories,
  fetchAsyncGetRakutenHistories,
} from './assetsSlice';
import styles from './Assets.module.css';
import './assets.css'

const columns: GridColDef[] = [
  { field: 'payment_date', headerName: 'DATE', minWidth: 300 },
  { field: 'store_name', headerName: 'STORE_NAME', minWidth: 500 },
  { field: 'payment', headerName: 'PAYMENT' , minWidth: 300 },
];

const Assets: React.FC = () => {
  const dispatch = useAppDispatch();
  const rakuten_histories = useAppSelector(selectRakutenHistories);

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetRakutenHistories());
    }
    fetchBootLoader();
  }, [dispatch]);

  return (
    <>
      <h3 className={styles.rakuten__title}>Rakuten Card Payment History</h3>
      <div style={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rakuten_histories}
          columns={columns}
          pageSize={100}
          rowsPerPageOptions={[100]}
        />
      </div>
      <h3 className={styles.amazon_title}>Amazon Purchase History</h3>
    </>
  )
};

export default Assets;
