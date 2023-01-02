import React, {FC, useEffect, useState} from 'react';
import {useForm} from 'react-hook-form';
import classes from './auth.module.scss';

import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useRegistrationMutation } from '../../services/AuthService';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { changeStatusOnLogin } from '../../store/slices/authStatusSlice';

export interface IRegisterFormState  {
    email:string,
    password: string,
    name:string,
    confirmPassword:string
}

const RegistrationForm: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    
    const [registration, { isSuccess:registrationSuccess, data:registrationData, error:registrationError }] = useRegistrationMutation();

    const validationSchema = Yup.object().shape({
        name: Yup.string()
          .required('Name is required')
          .min(3, 'Name must be at least 3 characters')
          .max(20, 'Name must not exceed 20 characters'),
        email: Yup.string()
          .required('Email is required')
          .email('Email is invalid'),
        password: Yup.string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters')
          .max(40, 'Password must not exceed 40 characters'),
        confirmPassword: Yup.string()
          .required('Confirm Password is required')
          .oneOf([Yup.ref('password'), null], 'Confirm Password does not match')
      });

    const {register, handleSubmit, formState: { errors, isValid }, reset} = useForm<IRegisterFormState>({
        mode:"all",
        resolver: yupResolver(validationSchema)
    });
    
    const handleRegistration = async (formState:IRegisterFormState) => {
        try {
            const registerUser = await registration(formState).unwrap()
            dispatch(setCredentials({token:registerUser.token, user:registerUser.user}))
        } catch (e: any) {
            setError(e.data.message);
        }
    }

    const onSubmit =  (data: IRegisterFormState) => {
        handleRegistration(data)
        reset()

        setTimeout( ()=> setError(null), 5000)
    }

    useEffect(() => {
        if(registrationSuccess) {
            navigate('/home');
        }
    }, [registrationSuccess])

    useEffect(() => {
        setError(null)
    }, [])

    return (
    <div className={classes.form__wrapper}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>{error && <p>{error}</p>}</div>
            <label>Name
                <input 
                    {...register("name")} 
                    placeholder='Enter your name'
                    className={errors.name && classes.is_invalid }/>
            </label>
            <div>{errors.name && <p>{errors.name?.message || "Error"}</p>}</div>
            <label>Email
                <input 
                    {...register("email")} 
                    placeholder='Enter your email'
                    className={errors.email && classes.is_invalid }/>
            </label>
            <div>{errors.email && <p>{errors.email?.message || "Error"}</p>}</div>
            <label>Password
                <input 
                    {...register("password")} 
                    placeholder='Enter your password'
                    type="password"
                    className={errors.password && classes.is_invalid }/>
            </label>
            <div>{errors.password && <p>{errors.password?.message || "Error"}</p>}</div>
            <label>Confirm Password
                <input 
                    {...register("confirmPassword")} 
                    placeholder='Confirm password'
                    type="password"
                    className={errors.confirmPassword && classes.is_invalid }/>
            </label>
            <div>{errors.confirmPassword && <p>{errors.confirmPassword?.message || "Error"}</p>}</div>
             <input type="submit" disabled={!isValid} value="Register" />
         </form>
         <div className={classes.auth__btn__navigate} 
            onClick={() => dispatch(changeStatusOnLogin('login'))}>
                Already have a profile? Sign in
        </div>
    </div>
    );
};

export default RegistrationForm;