import React from 'react';
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { TextField, InputLabel, Select, MenuItem } from '@material-ui/core';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import InputAdornment from '@mui/material/InputAdornment';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import { Formik } from 'formik';
import * as Yup from 'yup';

import {
  selectOpenMealForm,
  selectEditedMeal,
  selectCompanies,
  fetchCredStart,
  resetOpenMealForm,
  fetchAsyncUpdateMeal,
} from './mealSlice';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  height: 1000,
  bgcolor: 'background.paper',
  border: '1px solid #e0e0e0',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

const MealForm: React.FC = () => {
  const dispatch = useAppDispatch();
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
        await dispatch(resetOpenMealForm());
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={style}>
        <Formik
          initialErrors={{ name: 'required' }}
          initialValues={{ id: editedMeal.id, company: 1, name: '', price: 0, calorie: 0, protein: 0,
                           carbohydrate: 0, sugar: 0, lipid: 0, dietary_fiber: 0, salt: 0, is_bad: false }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart())
            const result = await dispatch(fetchAsyncUpdateMeal(values));
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required('name is must'),
            price: Yup.number(),
          })}
        >
          {formik => (
            <form onSubmit={formik.handleSubmit}>
              <h2>{editedMeal.id === 0 ? 'New Meal' : 'Update Meal'}</h2>
              <br />

              <FormControl>
                <InputLabel>company name</InputLabel>
                <Select
                  name='company'
                  onChange={formik.handleChange}
                  value={formik.values.company}
                >
                  {companyOptions}
                </Select>
              </FormControl>
              <TextField
                label='name'
                placeholder='name'
                type='input'
                name='name'
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              <TextField
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
              <TextField
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
              <TextField
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
              <TextField
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
              <TextField
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
              <TextField
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
              <TextField
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
              <TextField
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
              <FormControlLabel
                name='is_bad'
                value='is bad'
                control={<Switch color='primary' />}
                label='is bad'
                labelPlacement='start'
              />
            </form>
          )}
        </Formik>
      </Box>
    </Modal>
  )
};

export default MealForm;
