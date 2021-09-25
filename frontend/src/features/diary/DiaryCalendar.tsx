import React from 'react';
import { useAppDispatch } from "../../app/hooks";
import { IconButton, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import {
  setOpenDiaryForm,
} from './diarySlice';
import DiaryForm from './DiaryForm';

const DiaryCalendar: React.FC = () => {
  const dispatch = useAppDispatch();

  return (
    <>
      <DiaryForm />
      <Tooltip title='Create' aria-label='create'>
        <IconButton
          style={{ color: 'lightblue' }}
          onClick={async () => {
            await dispatch(setOpenDiaryForm());
          }}
        >
          <AddIcon style={{ fontSize: 30 }} />
        </IconButton>
      </Tooltip>
    </>
  )
};

export default DiaryCalendar;
