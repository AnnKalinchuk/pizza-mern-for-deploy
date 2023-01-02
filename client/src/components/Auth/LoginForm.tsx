import React, { FC, useEffect, useState} from 'react';
import classes from './auth.module.scss';
import {useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { LoginRequest, useLoginMutation } from '../../services/AuthService';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { changeStatusOnRegister } from '../../store/slices/authStatusSlice';
import { closeModal } from '../../store/slices/modalSlice';

const LoginForm: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState(null);
    
    const [login, { isSuccess:loginSuccess, data:loginData, isError, error:loginError }] = useLoginMutation();

    const validationSchema = Yup.object().shape({
        email: Yup.string()
          .required('Email is required')
          .email('Email is invalid'),
        password: Yup.string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters')
          .max(40, 'Password must not exceed 40 characters')
      });

    const {register, handleSubmit, formState: { errors, isValid }, reset} = useForm<LoginRequest>({
        mode:"all",
        resolver: yupResolver(validationSchema)
    });
    
    const handleLogin = async (formState:LoginRequest) => {
        try {
            const user = await login(formState).unwrap()
            dispatch(setCredentials( user))
        } catch (e:any) {
            setErrorMessage(e.data.message);
        }
    }

    const onSubmit =  (data: LoginRequest) => {
        handleLogin(data);
        reset();

        //удаляет серверную ошибку
        setTimeout( ()=> setErrorMessage(null), 5000)
    }

    useEffect(() => {
        if(loginSuccess) {
            navigate('/home')
            dispatch(closeModal());
        }
    }, [loginSuccess])

    useEffect(() => {
        setErrorMessage(null)
    }, [])


    return (
    <div className={classes.form__wrapper}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>{errorMessage && <p>{errorMessage}</p>}</div>
            <label>Email
                <input 
                    {...register("email")} 
                    placeholder='Enter your email'
                    className={errors.email && classes.is_invalid }
                    />
            </label>
            <div>{errors.email && <p>{errors.email?.message || "Error"}</p>}</div>
            <label>Password
                <input 
                    {...register("password")} 
                    placeholder='Enter your password'
                    type="password"
                    className={errors.password && classes.is_invalid }
                 />
            </label>
            <div>{errors.password && <p>{errors.password?.message || "Error"}</p>}</div>
            <input type="submit" disabled={!isValid} value="Sign in" />
        </form>
        <div className={classes.auth__btn__navigate} 
            onClick={() => dispatch(changeStatusOnRegister('register'))}>
            No profile? Sign up
        </div>
    </div>
    );
};

export default LoginForm;