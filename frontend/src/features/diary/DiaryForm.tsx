import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  InputAdornment,
  Modal,
  TextField,
} from '@mui/material';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { DatePicker, TimePicker } from '@mui/lab';
import jaLocale from 'date-fns/locale/ja';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';

import {
  initialState,
  selectIsLoadingDiary,
  selectOpenDiaryForm,
  selectEditedDiary,
  selectOptionMeals,
  fetchCredStart,
  fetchCredEnd,
  resetOpenDiaryForm,
  fetchAsyncGetMealOptions,
  fetchAsyncGetOneDiary,
  fetchAsyncCreateDiary,
  fetchAsyncUpdateDiary,
} from './diarySlice';
import { DIARY } from '../types';
import * as utils from '../../utils/common';
import './diaryForm.css';

const BoxStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  minHeight: 600,
  bgcolor: 'background.paper',
  border: '1px solid #e0e0e0',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

const canCreateDiary = (diary: DIARY) => {
  return diary.id === 0;
};

const DiaryForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const isLoadingDiary = useAppSelector(selectIsLoadingDiary);
  const openDiaryForm = useAppSelector(selectOpenDiaryForm);
  const editedDiary = useAppSelector(selectEditedDiary);
  const optionMeals = useAppSelector(selectOptionMeals);

  useEffect(() => {
    const fetchBootLoader = async () => {
      await dispatch(fetchAsyncGetMealOptions());
      const today = utils.dateFormatChange(new Date().toString());
      await dispatch(fetchAsyncGetOneDiary(today));
    }
    fetchBootLoader();
  }, [dispatch]);

  return (
    <Modal
      open={openDiaryForm}
      onClose={async () => {
        if (!isLoadingDiary) {
          await dispatch(resetOpenDiaryForm());
        }
      }}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={BoxStyle}>
        <Formik
          initialErrors={{ date: 'required' }}
          initialValues={canCreateDiary(editedDiary) ? initialState.editedDiary : editedDiary}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart());

            const data = { ...values };
            data.date = utils.dateFormatChange(data.date);
            data.wake_up_time = utils.timeFormatChange(values.wake_up_time);
            data.bedtime = utils.timeFormatChange(values.bedtime);
            data.ate_meal = data.ate_meal.map((m: any) => m.value);

            let result;
            let today = utils.dateFormatChange(new Date().toString());
            if (canCreateDiary(editedDiary)) {
              result = await dispatch(fetchAsyncCreateDiary(data));
            } else {
              result = await dispatch(fetchAsyncUpdateDiary(data));
            }
            if (fetchAsyncCreateDiary.fulfilled.match(result) || fetchAsyncUpdateDiary.fulfilled.match(result)) {
              await dispatch(resetOpenDiaryForm());
              await dispatch(fetchAsyncGetOneDiary(today));
            }
            await dispatch(fetchCredEnd());
          }}
          validationSchema={Yup.object().shape({
            date: Yup.string(),
            wake_up_time: Yup.string(),
            bedtime: Yup.string(),
            morning_weight: Yup.number(),
            night_weight: Yup.number(),
            ate_meal: Yup.array(),
            comment: Yup.string(),
          })}
        >
          {formik => (
            <form onSubmit={formik.handleSubmit}>
              <h2>{canCreateDiary(editedDiary) ? 'New diary' : 'Update diary'}</h2>
              <br />

              <Grid container spacing={3}>
                <Grid item xs={12} textAlign='center'>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label='date'
                      inputFormat='yyyy/MM/dd'
                      mask='____/__/__'
                      disabled={!canCreateDiary(editedDiary)}
                      value={formik.values.date}
                      onChange={(date) => {
                        formik.setFieldValue('date', date);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={jaLocale}>
                    <TimePicker
                      label='wake up time'
                      inputFormat='HH:mm'
                      value={formik.values.wake_up_time}
                      onChange={(time) => {
                        formik.setFieldValue('wake_up_time', time);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDateFns} locale={jaLocale}>
                    <TimePicker
                      label='bedtime'
                      value={formik.values.bedtime}
                      onChange={(time) => {
                        formik.setFieldValue('bedtime', time);
                      }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    variant='outlined'
                    label='morning weight'
                    type='number'
                    name='morning_weight'
                    value={formik.values.morning_weight}
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>kg</InputAdornment>,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth={true}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    variant='outlined'
                    label='night weight'
                    type='number'
                    name='night_weight'
                    value={formik.values.night_weight}
                    InputProps={{
                      endAdornment: <InputAdornment position='end'>kg</InputAdornment>,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth={true}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Select
                    placeholder='ate meals'
                    isMulti
                    name='ate_meal'
                    value={formik.values.ate_meal}
                    onChange={(option) => {
                      formik.setFieldValue('ate_meal', option)
                    }}
                    options={optionMeals}
                    onBlur={formik.handleBlur}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label='comment'
                    name='comment'
                    multiline
                    rows={8}
                    value={formik.values.comment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    fullWidth={true}
                  />
                </Grid>

                <Grid item xs={12} textAlign='center'>
                  {isLoadingDiary ?
                    <CircularProgress />
                      :
                    <Button
                      variant='contained'
                      type='submit'
                    >
                      {canCreateDiary(editedDiary) ? 'create' : 'update'}
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

export default DiaryForm;
