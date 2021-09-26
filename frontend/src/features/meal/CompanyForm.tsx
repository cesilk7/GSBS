import React from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { Box, Button, Modal, TextField } from '@mui/material';

import {
  initialState,
  selectOpenCompanyForm,
  selectEditedCompany,
  resetOpenCompanyForm,
  setEditedCompany,
  fetchAsyncCreateCompany,
  fetchAsyncUpdateCompany,
} from './mealSlice';

const BoxStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  height: 150,
  bgcolor: 'background.paper',
  border: '1px solid #e0e0e0',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

const CompanyForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const openCompanyForm = useAppSelector(selectOpenCompanyForm);
  const editedCompany = useAppSelector(selectEditedCompany);

  const handleInputTextChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await dispatch(setEditedCompany({
      id: editedCompany.id,
      name: e.target.value
    }));
  };

  const create_or_update_company = async () => {
    let result;
    if (editedCompany.id === 0) {
      result = await dispatch(fetchAsyncCreateCompany(editedCompany));
    } else {
      result = await dispatch(fetchAsyncUpdateCompany(editedCompany));
    }
    if (fetchAsyncCreateCompany.fulfilled.match(result) || fetchAsyncUpdateCompany.fulfilled.match(result)) {
      await dispatch(setEditedCompany(initialState.editedCompany));
      await dispatch(resetOpenCompanyForm());
    }
  };

  return (
    <Modal
      open={openCompanyForm}
      onClose={async () => {
        await dispatch(setEditedCompany(initialState.editedCompany));
        await dispatch(resetOpenCompanyForm());
      }}
    >
      <Box sx={BoxStyle}>
        <br />
        <form style={{ textAlign: 'center' }}>
          <TextField
            variant='standard'
            fullWidth={true}
            label='company name'
            type='text'
            value={editedCompany.name}
            onChange={handleInputTextChange}
          />
          <br />
          <br />
          <br />
          <Button
            variant='contained'
            color='primary'
            onClick={create_or_update_company}
          >
            {editedCompany.id === 0 ? 'create' : 'update'}
          </Button>
        </form>
      </Box>
    </Modal>
  )
};

export default CompanyForm;
