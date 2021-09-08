import React from 'react';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Modal from 'react-modal';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { TextField, Button, CircularProgress } from "@material-ui/core";

import { AUTHENTIC } from "../types";
import {
  selectOpenSignIn,
  selectOpenSingUp,
  selectIsLoadingAuth,
  fetchCredStart,
  fetchCredEnd,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  fetchAsyncRegister,
  fetchAsyncLogin,
  fetchAsyncCreateProf,
  fetchAsyncGetMyProf,
} from "./authSlice";
import styles from './Auth.module.css';

const modalStyle = {
  overlay: {
    backgroundColor: "#777777",
  },
  content: {
    top: "50%",
    left: "50%",

    width: 300,
    height: 370,
    padding: "50px",

    transform: "translate(-50%, -50%)",
  }
}

const Auth: React.FC = () => {
  Modal.setAppElement('#root');
  const openSignIn = useAppSelector(selectOpenSignIn);
  const openSignUp = useAppSelector(selectOpenSingUp);
  const isLoadingAuth = useAppSelector(selectIsLoadingAuth);
  const dispatch = useAppDispatch();

  return (
    <>
      <Modal
        isOpen={openSignUp}
        onRequestClose={async () => {
          await dispatch(resetOpenSignUp());
        }}
        style={modalStyle}
      >
        <Formik
          initialErrors={{ email: 'required' }}
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values: AUTHENTIC) => {
            await dispatch(fetchCredStart());
            const result = await dispatch(fetchAsyncRegister(values));
            if (fetchAsyncRegister.fulfilled.match(result)) {
              await dispatch(fetchAsyncLogin(values));
              await dispatch(fetchAsyncCreateProf({ username: 'anonymous' }));

              await dispatch(fetchAsyncGetMyProf());
            }
            await dispatch(fetchCredEnd());
            await dispatch(resetOpenSignUp());
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('email format is wrong')
              .required('email is must'),
            password: Yup.string().required('password is must').min(8),
          })}
        >
          {formik => (
            <form onSubmit={formik.handleSubmit}>
              <div className={styles.auth_signUp}>
                <h1 className={styles.auth_title}>life management</h1>
                <br />
                <div className={styles.auth_progress}>
                  {isLoadingAuth && <CircularProgress />}
                </div>
                <br />

                <TextField
                  placeholder='email'
                  type='input'
                  name='email'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                <br />
                {formik.touched.email && formik.errors.email ? (
                  <div className={styles.auth_error}>{formik.errors.email}</div>
                ) : <div className={styles.auth_error} />}

                <TextField
                  placeholder='password'
                  type='password'
                  name='password'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <br />
                {formik.touched.password && formik.errors.password ? (
                  <div className={styles.auth_error}>{formik.errors.password}</div>
                ) : <div className={styles.auth_error} />}
                <br />

                <Button
                  variant='contained'
                  color='primary'
                  disabled={!formik.isValid}
                  type='submit'
                >
                  Register
                </Button>
                <br />
                <br />
                <span
                  className={styles.auth_text}
                  onClick={async () => {
                    await dispatch(setOpenSignIn());
                    await dispatch(resetOpenSignUp());
                  }}
                >
                  You already have a account ?
                </span>
              </div>
            </form>
          )}
        </Formik>
      </Modal>

      <Modal
        isOpen={openSignIn}
        onRequestClose={async () => {
          await dispatch(resetOpenSignIn());
        }}
        style={modalStyle}
      >
        <Formik
          initialErrors={{ email: 'required' }}
          initialValues={{ email: '', password: '' }}
          onSubmit={async (values) => {
            await dispatch(fetchCredStart());
            const result = await dispatch(fetchAsyncLogin(values));

            if (fetchAsyncLogin.fulfilled.match(result)) {
              await dispatch(fetchAsyncGetMyProf());
            }
            await dispatch(fetchCredEnd());
            await dispatch(resetOpenSignIn());
          }}
          validationSchema={Yup.object().shape({
            email: Yup.string().email('email format is wrong')
              .required('email is must'),
            password: Yup.string().required('password is must').min(8)
          })}
        >
          {formik => (
            <form onSubmit={formik.handleSubmit}>
              <div className={styles.auth_signUp}>
                <h1 className={styles.auth_title}>life management</h1>
                <br />
                <div className={styles.auth_progress}>
                  {isLoadingAuth && <CircularProgress />}
                </div>
                <br />

                <TextField
                  placeholder='email'
                  type='input'
                  name='email'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                />
                <br />
                {formik.touched.email && formik.errors.email ? (
                  <div className={styles.auth_error}>{formik.errors.email}</div>
                ) : <div className={styles.auth_error} />}

                <TextField
                  placeholder='password'
                  type='password'
                  name='password'
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                />
                <br />
                {formik.touched.password && formik.errors.password ? (
                  <div className={styles.auth_error}>{formik.errors.password}</div>
                ) : <div className={styles.auth_error} />}
                <br />

                <Button
                  variant='contained'
                  color='primary'
                  disabled={!formik.isValid}
                  type='submit'
                >
                  Login
                </Button>
                <br />
                <br />
                <span
                  className={styles.auth_text}
                  onClick={async () => {
                    await dispatch(resetOpenSignIn());
                    await dispatch(setOpenSignUp());
                  }}
                >
                  You don't have a account ?
                </span>
              </div>
            </form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default Auth;
