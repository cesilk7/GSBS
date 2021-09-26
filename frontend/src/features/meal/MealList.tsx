import React, { useEffect, useCallback } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { FaFileUpload, FaFileDownload } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import AddIcon from '@mui/icons-material/Add';
import UpdateIcon from '@mui/icons-material/Update';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Button, Grid, Tooltip, IconButton } from '@mui/material';
import { DataGrid, GridColDef, GridCellEditCommitParams } from '@mui/x-data-grid';
import { useAppSelector, useAppDispatch } from '../../app/hooks';

import {
  selectSelectedRowIds,
  selectMeals,
  setOpenDeleteDialog,
  setOpenUpdateDialog,
  setOpenMealForm,
  setSelectedRowIds,
  setMeals,
  fetchAsyncGetMeals,
  fetchAsyncGetCompanies, setEditedMeal,
} from './mealSlice';
import './mealList.css';
import MealDialog from './MealDialog';
import MealForm from './MealForm';
import CompanyForm from './CompanyForm';

const useStyles = makeStyles((theme: Theme) => ({
  buttonRow: {
    margin: theme.spacing(1),
  },
}));

const MealList: React.FC = () => {
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const meals = useAppSelector(selectMeals);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', minWidth: 100, headerAlign: 'center', align: 'center' },
    { field: 'company_name', headerName: 'Company', flex: 1, headerAlign: 'center', editable: false },
    { field: 'name', headerName: 'Meal', flex: 1, headerAlign: 'center', editable: true },
    { field: 'price', headerName: 'Price', type: 'number', minWidth: 110, headerAlign: 'center', editable: true },
    { field: 'calorie', headerName: 'Calorie', type: 'number', minWidth: 130, headerAlign: 'center', editable: true },
    { field: 'protein', headerName: 'Protein', type: 'number', minWidth: 130, headerAlign: 'center', editable: true },
    { field: 'sugar', headerName: 'Sugar', type: 'number', minWidth: 130, headerAlign: 'center', editable: true },
    { field: 'Edit', sortable: false, minWidth: 110, headerAlign: 'center', align: 'center',
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            await dispatch(setEditedMeal(params.row));
            await dispatch(setOpenMealForm());
          }}
          startIcon={<FiEdit />}
        />
      )
    },
  ];

  const handleCellEditCommit = useCallback(
    ({ id, field, value }: GridCellEditCommitParams) => {
      const updateRows = meals.map((row) => {
        if (row.id === id) {
          return { ...row, [field]: value };
        }
        return row;
      });
      dispatch(setMeals(updateRows));
    },
    [meals, dispatch],
  );

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetMeals());
      await dispatch(fetchAsyncGetCompanies());
    }
    fetchBootLoader();
  }, [dispatch]);

  return (
    <>
      <MealDialog />
      <MealForm />
      <CompanyForm />
      <br />
      <Grid
        className={classes.buttonRow}
        container
        justifyContent='center'
      >
        <Grid item xs={2}>
          <Tooltip title='Csv upload' aria-label='csv upload'>
            <IconButton
              color='secondary'
            >
              <FaFileUpload style={{ fontSize: 25 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Csv download' aria-label='csv download'>
            <IconButton
              color='secondary'
            >
              <FaFileDownload style={{ fontSize: 25 }} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={8}/>
        <Grid item xs={2}>
          <Tooltip title='Delete' aria-label='delete'>
            <IconButton
              style={{ color: 'gray' }}
              onClick={async () => {
                await dispatch(setOpenDeleteDialog());
              }}
            >
              <DeleteForeverIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Update' aria-label='update'>
            <IconButton
              style={{ color: 'lightgreen' }}
              onClick={async () => {
                await dispatch(setOpenUpdateDialog());
              }}
            >
              <UpdateIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Create' aria-label='create'>
            <IconButton
              id='createButton'
              style={{ color: 'lightblue' }}
              onClick={async () => {
                await dispatch(setOpenMealForm());
              }}
            >
              <AddIcon style={{ fontSize: 30 }} />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <div style={{ width: '100%' }}>
        <DataGrid
          autoHeight
          rows={meals}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
          onSelectionModelChange={(newSelectionModel) => {
            dispatch(setSelectedRowIds(newSelectionModel));
          }}
          selectionModel={selectedRowIds}
          onCellEditCommit={handleCellEditCommit}
        />
      </div>
    </>
  )
};

export default MealList;
