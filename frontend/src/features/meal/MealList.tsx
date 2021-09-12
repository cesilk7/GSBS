import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { FaFileUpload, FaFileDownload } from 'react-icons/fa';
import { AiFillDelete } from 'react-icons/ai';
import { RiAddCircleLine } from 'react-icons/ri';
import { GrUpdate } from 'react-icons/gr';
import { GiCancel } from 'react-icons/gi';
import { Button, Avatar, Badge } from '@material-ui/core';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

import { MEAL } from '../types';
import {
  fetchAsyncGetMeals,
  initialState,
  selectMeals,
  setOpenDeleteDialog,
  setOpenUpdateDialog,
  setSelectedRowIds,
} from './mealSlice';
import styles from './MealList.module.css';
import './mealList.css';
import {fetchAsyncGetMyProf} from '../auth/authSlice';
import MealDialog from './MealDialog';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'company_name', headerName: 'Company', width: 150, editable: false },
  { field: 'name', headerName: 'Meal name', width: 150, editable: true },
  { field: 'price', headerName: 'Price', type: 'number', width: 110, editable: true },
  { field: 'calorie', headerName: 'Calorie', type: 'number', width: 130, editable: true },
  { field: 'protein', headerName: 'Protein', type: 'number', width: 130, editable: true },
  { field: 'sugar', headerName: 'Sugar', type: 'number', width: 130, editable: true },
  { field: 'Edit', sortable: false, width: 110,
    renderCell: (params) => (
      <Button variant="contained" color="primary">
        Edit {params.id}
      </Button>
    )
  },
];

const useStyles = makeStyles((theme: Theme) => ({
  button: {
    margin: theme.spacing(2),
    width: 180,
  },
}));

const MealList: React.FC = () => {
  const classes = useStyles()
  const dispatch = useAppDispatch();
  const meals = useAppSelector(selectMeals);

  useEffect(() => {
    dispatch(fetchAsyncGetMeals());
  }, [dispatch]);

  return (
    <>
      <MealDialog />
      <Button
        className={classes.button}
        variant='contained'
        color='secondary'
        startIcon={<FaFileUpload />}
      >
        csv upload
      </Button>
      <Button
        className={classes.button}
        variant='contained'
        color='secondary'
        startIcon={<FaFileDownload/>}
      >
        csv download
      </Button>
      <Button
        className={classes.button}
        variant='contained'
        color='secondary'
        startIcon={<AiFillDelete />}
        onClick={async () => {
          await dispatch(setOpenDeleteDialog());
        }}
      >
        partial delete
      </Button>
      <Button
        className={classes.button}
        variant='contained'
        color='secondary'
        startIcon={<GrUpdate className='update_icon' />}
        onClick={async () => {
          await dispatch(setOpenUpdateDialog());
        }}
      >
        partial update
      </Button>
      <Button
        className={classes.button}
        variant='contained'
        color='secondary'
        startIcon={<RiAddCircleLine />}
      >
        create
      </Button>
      <br />
      <br />
      <div style={{ height: 645, width: '100%' }}>
        <DataGrid
          rows={meals}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={async (ids) => {
            await dispatch(setSelectedRowIds(ids));
          }}
        />
      </div>
    </>
  )
};

export default MealList;
