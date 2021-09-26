import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField
} from '@mui/material';

import { File } from '../types';
import {
  editUsername,
  selectMyProfile,
  selectOpenProfile,
  resetOpenProfile,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncUpdateProf,
} from '../auth/authSlice';
import styles from './Home.module.css';
import { MdAddAPhoto } from "react-icons/all";

const BoxStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 280,
  height: 220,
  bgcolor: 'background.paper',
  border: '1px solid #e0e0e0',
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

const EditProfile: React.FC = () => {
  const dispatch = useAppDispatch();
  const openProfile = useAppSelector(selectOpenProfile);
  const profile = useAppSelector(selectMyProfile);
  const [image, setImage] = useState<File | null>(null);

  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { id: profile.id, username: profile.username, img: image };

    await dispatch(fetchCredStart());
    await dispatch(fetchAsyncUpdateProf(packet));
    await dispatch(fetchCredEnd());
    await dispatch(resetOpenProfile());
  };

  const handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput?.click();
  };

  return (
    <Modal
      open={openProfile}
      onClose={async () => {
        await dispatch(resetOpenProfile());
      }}
    >
      <Box sx={BoxStyle}>
        <form className={styles.home__profile}>
          <h1 className={styles.home__title}>life management</h1>
          <br />
          <TextField
            placeholder='username'
            type='text'
            value={profile?.username}
            onChange={(e) => dispatch(editUsername(e.target.value))}
          />
          <input
            type='file'
            id='imageInput'
            hidden={true}
            onChange={(e) => setImage(e.target.files![0])}
          />
          <br />
          <IconButton onClick={handleEditPicture}>
            <MdAddAPhoto />
          </IconButton>
          <br />
          <Button
            disabled={!profile?.username}
            variant='contained'
            color='primary'
            type='submit'
            onClick={updateProfile}
          >
            Update
          </Button>
        </form>
      </Box>
    </Modal>
  )
};

export default EditProfile;
