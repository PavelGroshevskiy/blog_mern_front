import React from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from "react-hook-form";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";


import styles from "./Login.module.scss";
import {fetchAuth, selectIsAuth} from "../../redux/slices/auth";

export const Login = () => {

    const isAuth = useSelector(selectIsAuth) // авторизован или нет?
    const dispatch = useDispatch()

    const {register, handleSubmit, setError, formState: {errors, isValid}} = useForm({ // Form library on
        defaultValues: {
            email: 'Vasya@gmail.com',
            password: '12345'
        },
        mode: 'onChange'
    })

    //функция выполняетя если валидация прошла успешно
    const onSubmit = async (values) => {
       const data = await dispatch(fetchAuth(values))
        console.log(data)

        if (!data.payload) {
            return alert('Не удалось авторизоваться')
        }

        if ('token' in data.payload.data) {
            window.localStorage.setItem('token', data.payload.data.token )
        }
    }

    if (isAuth) {
        return <Navigate to='/'/>
    }

  return (
      <Paper classes={{ root: styles.root }}>
          <Typography classes={{ root: styles.title }} variant="h5">
              Вход в аккаунт
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
              className={styles.field}
              label="E-Mail"
              type='email'
              error={Boolean(errors.email?.message)}
              helperText={errors.email?.message} //вытаскиваем из useForm errors
              {...register('email', {required:'Укажите email'})}
              fullWidth
          />
          <TextField className={styles.field}
              label="Пароль"
              helperText={errors.password?.message} //вытаскиваем из useForm errors
              {...register('password', {required:'Укажите пароль'})} //регистрируем форму в useForm
              fullWidth />
          <Button type='submit' size="large" variant="contained" fullWidth>
              Войти
          </Button>
          </form>
      </Paper>
  );
};
