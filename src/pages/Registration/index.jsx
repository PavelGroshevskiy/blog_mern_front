import React from 'react';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {fetchAuth, fetchRegister, selectIsAuth} from "../../redux/slices/auth";
import {useForm} from "react-hook-form";

export const Registration = () => {

    const isAuth = useSelector(selectIsAuth) // авторизован или нет?
    const dispatch = useDispatch()

    const {register, handleSubmit, formState: {errors, isValid}} = useForm({ // Form library on
        defaultValues: {
            fullName: 'Vasya Perkin',
            email: 'Vasya@gmail.com',
            password: '1234'
        },
        mode: 'onChange'
    })

    const onSubmit = async (values) => {
        const data = await dispatch(fetchRegister(values))
        console.log(data)

        if (!data.payload) {
            return alert('Не удалось зарегестрироваться')
        }

        if ('token' in data.payload.data) {
            window.localStorage.setItem('token', data.payload.data.token )
        }
    }

  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Создание аккаунта
      </Typography>
      <div className={styles.avatar}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
          <TextField className={styles.field} label="Полное имя" fullWidth
                     {...register('fullName', {required:'Укажите полное имя'})}
                     helperText={errors.fullName?.message}
                     error={Boolean(errors.fullName?.message)}
          />

          <TextField className={styles.field} label="E-Mail" fullWidth
                     {...register('email', {required:'Укажите email'})}
                     helperText={errors.email?.message}
                     error={Boolean(errors.email?.message)}
                     type='email'
          />

          <TextField className={styles.field} label="Пароль" fullWidth
                     {...register('password', {required:'Укажите password'})}
                     helperText={errors.password?.message}
                     error={Boolean(errors.password?.message)}
                     type='password'
          />
          <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
              Зарегистрироваться
          </Button>
      </form>
    </Paper>
  );
};
