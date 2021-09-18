import React from 'react';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress
} from '@material-ui/core';
import { Box, Modal, InputAdornment, Switch, FormControlLabel, FormControl, Grid } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  initialState,
  selectIsLoadingMeal,
  selectOpenMealForm,
  selectEditedMeal,
  selectCompanies,
  fetchCredStart,
  fetchCredEnd,
  resetOpenMealForm,
  setEditedMeal,
  fetchAsyncCreateMeal,
  fetchAsyncUpdateMeal,
} from './mealSlice';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 600,
  bgcolor: 'background.paper',
  border: '1px solid #e0e0e0',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

const MealForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoadingMeal = useAppSelector(selectIsLoadingMeal);
  const openMealForm = useAppSelector(selectOpenMealForm);
  const editedMeal = useAppSelector(selectEditedMeal);
  const companies = useAppSelector(selectCompanies);

  let companyOptions = companies.map((c) => (
    <MenuItem key={c.id} value={c.id}>
      {c.name}
    </MenuItem>
  ));

  return (
    <Modal
      open={openMealForm}
      onClose={async () => {
        if (!isLoadingMeal) {
          await dispatch(resetOpenMealForm());
          await dispatch(setEditedMeal(initialState.editedMeal));
        }
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Formik
          initialErrors={{ name: 'required' }}
          initialValues={editedMeal.id === 0 ? initialState.editedMeal : editedMeal}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart())
            console.log(values);
            if (editedMeal.id === 0) {
              const result = await dispatch(fetchAsyncCreateMeal(values));
              if (fetchAsyncCreateMeal.fulfilled.match(result)) {
                await dispatch(resetOpenMealForm());
              }
            } else {
              const result = await dispatch(fetchAsyncUpdateMeal(values));
              if (fetchAsyncUpdateMeal.fulfilled.match(result)) {
                await dispatch(resetOpenMealForm());
              }
            }
            await dispatch(fetchCredEnd());
          }}
          validationSchema={Yup.object().shape({
            company: Yup.number().required(),
            name: Yup.string().required('name is must'),
            price: Yup.number(),
            calorie: Yup.number(),
            protein: Yup.number(),
            carbohydrate: Yup.number(),
            sugar: Yup.number(),
            lipid: Yup.number(),
            dietary_fiber: Yup.number(),
            salt: Yup.number(),
          })}
        >
          {formik => (
            <form onSubmit={formik.handleSubmit}>
              <h2>{editedMeal.id === 0 ? 'New Meal' : 'Update Meal'}</h2>
              <br />
              <br />

              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <FormControl fullWidth={true}>
                    <InputLabel>company name</InputLabel>
                    <Select
                      variant='standard'
                      name='company'
                      onChange={formik.handleChange}
                      value={formik.values.company}
                    >
                      {companyOptions}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant='standard'
                    fullWidth={true}
                    label='name'
                    placeholder='name'
                    type='input'
                    name='name'
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant='standard'
                    fullWidth={true}
                    label='price'
                    placeholder='price'
                    type='number'
                    name='price'
                    InputProps={{
                      endAdornment: <InputAdornment position="end">yen</InputAdornment>,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.price}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant='standard'
                    fullWidth={true}
                    label='calorie'
                    placeholder='calorie'
                    type='number'
                    name='calorie'
                    InputProps={{
                      endAdornment: <InputAdornment position="end">kcal</InputAdornment>,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.calorie}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant='standard'
                    fullWidth={true}
                    label='protein'
                    placeholder='protein'
                    type='number'
                    name='protein'
                    InputProps={{
                      endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.protein}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant='standard'
                    fullWidth={true}
                    label='carbohydrate'
                    placeholder='carbohydrate'
                    type='number'
                    name='carbohydrate'
                    InputProps={{
                      endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.carbohydrate}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant='standard'
                    fullWidth={true}
                    label='sugar'
                    placeholder='sugar'
                    type='number'
                    name='sugar'
                    InputProps={{
                      endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.sugar}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant='standard'
                    fullWidth={true}
                    label='lipid'
                    placeholder='lipid'
                    type='number'
                    name='lipid'
                    InputProps={{
                      endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.lipid}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant='standard'
                    fullWidth={true}
                    label='dietary fiber'
                    placeholder='dietary fiber'
                    type='number'
                    name='dietary_fiber'
                    InputProps={{
                      endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.dietary_fiber}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    variant='standard'
                    fullWidth={true}
                    label='salt'
                    placeholder='salt'
                    type='number'
                    name='salt'
                    InputProps={{
                      endAdornment: <InputAdornment position="end">g</InputAdornment>,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.salt}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    label='is bad'
                    labelPlacement='start'
                    name='is_bad'
                    control={formik.values.is_bad ? <Switch defaultChecked color='primary' /> : <Switch color='primary' />}
                    value={formik.values.is_bad}
                    onChange={formik.handleChange}
                  />
                </Grid>
                <Grid item xs={6} style={{ textAlign: 'right' }}>
                  {isLoadingMeal ?
                    <CircularProgress />
                      :
                    <Button
                      variant='contained'
                      type='submit'
                    >
                      {editedMeal.id === 0 ? 'create' : 'update'}
                    </Button>
                  }
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  )
};

export default MealForm;
