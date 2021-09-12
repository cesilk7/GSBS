import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions,
  Button } from '@material-ui/core'
import { useAppDispatch, useAppSelector } from "../../app/hooks";

import {
  selectOpenDeleteDialog,
  resetOpenDeleteDialog,
  selectOpenUpdateDialog,
  resetOpenUpdateDialog,
  selectSelectedRowIds,
  fetchAsyncDeleteMeal,
} from "./mealSlice";

export const MealDeleteDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const openDeleteDialog = useAppSelector(selectOpenDeleteDialog);
  const openUpdateDialog = useAppSelector(selectOpenUpdateDialog);
  const selectedRowIds = useAppSelector(selectSelectedRowIds);

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
            {selectedRowIds}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            onClick={async () => {
              await dispatch(resetOpenDeleteDialog());
            }}
          >
            Disagree
          </Button>
          <Button
            color="primary"
            onClick={async () => {
              await dispatch(fetchAsyncDeleteMeal(selectedRowIds));
              await dispatch(resetOpenDeleteDialog());
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openUpdateDialog}
        onClose={async () => {
          await dispatch(resetOpenUpdateDialog());
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
            {selectedRowIds}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
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
              await dispatch(resetOpenUpdateDialog());
            }}
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
};

export default MealDeleteDialog;
