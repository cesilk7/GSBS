import React from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  selectMeals,
  selectOpenDeleteDialog,
  resetOpenDeleteDialog,
  selectOpenUpdateDialog,
  resetOpenUpdateDialog,
  resetSelectedRowIds,
  selectIsLoadingMeal,
  selectSelectedRowIds,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncGetMeals,
  fetchAsyncDeleteMeals,
  fetchAsyncUpdateMeals,
} from "./mealSlice";

const useStyles = makeStyles((theme: Theme) => ({
  progress: {
    marginRight: 20,
    marginBottom: 10,
    color: 'blue',
  }
}));

export const MealDeleteDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const classes = useStyles();
  const openDeleteDialog = useAppSelector(selectOpenDeleteDialog);
  const openUpdateDialog = useAppSelector(selectOpenUpdateDialog);
  const isLoadingMeal = useAppSelector(selectIsLoadingMeal);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);
  const meals = useAppSelector(selectMeals);

  return (
    <>
      <Dialog
        open={openDeleteDialog}
        onClose={async () => {
          await dispatch(resetOpenDeleteDialog());
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to delete it?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete all the meals you have selected?
            <br />
            Deleted data cannot be undone.
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {isLoadingMeal ?
            <CircularProgress className={classes.progress} />
              :
            <>
              <Button
                color="primary"
                onClick={async () => {
                  if (!isLoadingMeal) {
                    await dispatch(resetOpenDeleteDialog());
                  }
                }}
              >
                Disagree
              </Button>
              <Button
                color="primary"
                onClick={async () => {
                  await dispatch(fetchCredStart());
                  await dispatch(fetchAsyncDeleteMeals(selectedRowIds));
                  await dispatch(fetchCredEnd());
                  await dispatch(resetOpenDeleteDialog());
                }}
                autoFocus
              >
                Agree
              </Button>
            </>
          }
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUpdateDialog}
        onClose={async () => {
          if (!isLoadingMeal) {
            await dispatch(resetOpenUpdateDialog());
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to update?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to update all the meals you have selected?
            <br />
            Update data cannot be undone.
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {isLoadingMeal ?
            <CircularProgress className={classes.progress} />
              :
            <>
              <Button
                color="primary"
                onClick={async () => {
                  await dispatch(resetOpenUpdateDialog());
                }}
              >
                Disagree
              </Button>
              <Button
                color="primary"
                onClick={async () => {
                  await dispatch(fetchCredStart());
                  const updateMeals = meals.filter((m) =>
                    selectedRowIds.includes(m.id)
                  );
                  console.log(updateMeals);
                  const result = await dispatch(fetchAsyncUpdateMeals(updateMeals));
                  if (fetchAsyncUpdateMeals.fulfilled.match(result)) {
                    await dispatch(fetchAsyncGetMeals());
                    await dispatch(resetSelectedRowIds());
                  }
                  await dispatch(fetchCredEnd());
                  await dispatch(resetOpenUpdateDialog());
                }}
                autoFocus
              >
                Agree
              </Button>
            </>
          }
        </DialogActions>
      </Dialog>
    </>
  )
};

export default MealDeleteDialog;
