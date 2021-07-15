import _ from 'lodash';
import * as yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import styles from './CreateAccount.module.css';

const REQUEST_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILURE: 'failure',
};

const createAccountSchema = yup.object().shape({
  email: yup.string().email('Email is not valid').required('Email is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], "Passwords don't match")
    .required('Confirm Password is required'),
});

const buildValidationMessage = errors =>
  _.head(
    Object.values(errors)
      .map(({ message }) => message)
      .sort(),
  );

export const CreateAccount = () => {
  const [requestStatus, setRequestStatus] = useState(REQUEST_STATUS.IDLE);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(createAccountSchema),
  });

  const onSubmit = async values => {
    const { email, password } = values;

    setRequestStatus(REQUEST_STATUS.PENDING);
    try {
      await axios.post('https://postman-echo.com/post', {
        email,
        password,
      });

      setRequestStatus(REQUEST_STATUS.SUCCESS);
    } catch (error) {
      setRequestStatus(REQUEST_STATUS.FAILURE);
    }
  };

  const isSubmitting = requestStatus === REQUEST_STATUS.PENDING;
  const isSuccess = requestStatus === REQUEST_STATUS.SUCCESS;
  const hasStatusText = [REQUEST_STATUS.SUCCESS, REQUEST_STATUS.FAILURE].includes(requestStatus);

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Sign Up</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input id="email" type="email" className={styles.input} {...register('email')} />

        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input id="password" type="password" className={styles.input} {...register('password')} />

        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password
        </label>
        <input id="confirmPassword" type="password" className={styles.input} {...register('confirmPassword')} />

        {!_.isEmpty(errors) && <span className={styles.validationMessage}>{buildValidationMessage(errors)}</span>}
        {hasStatusText && <span>{isSuccess ? 'Account was successfully created' : 'Something went wrong'}</span>}

        <button type="submit" className={styles.submit} disabled={isSubmitting}>
          Submit
        </button>
      </form>
    </main>
  );
};
