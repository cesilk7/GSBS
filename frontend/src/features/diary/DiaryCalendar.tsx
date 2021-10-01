import React, { useCallback } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';

import { DIARY } from "../types";
import {
  selectEditedDiary,
  setOpenDiaryForm,
  setEditedDiaryDate,
  fetchAsyncGetOneDiary,
  fetchAsyncGetCalendarEvents,
} from './diarySlice';
import DiaryForm from './DiaryForm';
import './diaryCalendar.css';
import * as utils from '../../utils/common';

const canCreateDiary = (diary: DIARY) => {
  return diary.id === 0;
};

const DiaryCalendar: React.FC = () => {
  const dispatch = useAppDispatch();
  const editedDiary = useAppSelector(selectEditedDiary);

  const handleEventsSet = useCallback(async (info, successCallback, failureCallback) => {
    const results = await dispatch(fetchAsyncGetCalendarEvents({
      start_date: utils.dateFormatChange(info.startStr),
      end_date: utils.dateFormatChange(info.endStr)
    }));
    return results.payload;
  }, []);

  const handleDateClick = useCallback(async (arg: DateClickArg) => {
    await dispatch(fetchAsyncGetOneDiary(arg.dateStr));
    if (canCreateDiary(editedDiary)) {
      await dispatch(setEditedDiaryDate(new Date(arg.dateStr).toString()));
    }
    await dispatch(setOpenDiaryForm());
  }, []);

  return (
    <>
      <DiaryForm />
      <div>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView='dayGridMonth'
          events={handleEventsSet}
          dateClick={handleDateClick}
        />
      </div>
    </>
  )
};

export default DiaryCalendar;
