import React from 'react';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Switch,
  Tooltip,
  TextField,
} from '@mui/material';
import { FaStoreAlt } from 'react-icons/fa'
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
  setOpenCompanyForm,
  setEditedMeal,
  setEditedCompany,
  fetchAsyncCreateMeal,
  fetchAsyncUpdateMeal,
} from './mealSlice';
import { PROPS_MEAL } from "../types";

const BoxStyle = {
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

const canCreateMeal = (meal: PROPS_MEAL) => {
  return meal.id === 0;
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
    >
      <Box sx={BoxStyle}>
        <Formik
          initialErrors={{ name: 'required' }}
          initialValues={canCreateMeal(editedMeal) ? initialState.editedMeal : editedMeal}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart())
            let result;
            if (canCreateMeal(editedMeal)) {
              result = await dispatch(fetchAsyncCreateMeal(values));
            } else {
              result = await dispatch(fetchAsyncUpdateMeal(values));
            }
            if (fetchAsyncCreateMeal.fulfilled.match(result) || fetchAsyncUpdateMeal.fulfilled.match(result)) {
              await dispatch(resetOpenMealForm());
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
              <Grid container alignItems='center'>
                <Grid item xs={11}>
                  <h2>{canCreateMeal(editedMeal) ? 'New Meal' : 'Edit Meal'}</h2>
                </Grid>
                <Grid item xs={1}>
                  <Tooltip title='edit company' aria-label='edit company'>
                    <IconButton
                      color='error'
                      onClick={async () => {
                        const companyId = (document.getElementsByName('company')[0] as HTMLInputElement)?.value
                        if (companyId !== '0' && companyId !== '') {
                          await dispatch(setEditedCompany({
                            id: (document.getElementsByName('company')[0] as HTMLInputElement)?.value,
                            name: (document.getElementById('companyName') as HTMLInputElement)?.innerHTML
                          }));
                        }
                        await dispatch(setOpenCompanyForm());
                      }}
                    >
                      <FaStoreAlt style={{ fontSize: 25 }} />
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
              <br />
              <br />

              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <FormControl fullWidth={true}>
                    <InputLabel>company name</InputLabel>
                    <Select
                      variant='standard'
                      id='companyName'
                      name='company'
                      onChange={formik.handleChange}
                      value={formik.values.company}
                    >
                      <MenuItem key='0' value='0'>
                        <em>None</em>
                      </MenuItem>
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
                      {canCreateMeal(editedMeal) ? 'create' : 'update'}
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
