import React, { FC } from 'react';
import { useAppSelector } from '../../hooks/hooks';
import { RootState } from '../../store';
import classes from './auth.module.scss';
import LoginForm from './LoginForm';
import RegistrationForm from './RegistrationForm';

const Auth : FC = () => {
    const { status } = useAppSelector((state: RootState ) => state.authStatus)

    return (
        <div>
            <div className={classes.auth__status}>
                {status === 'login' ? <p>Sign in</p> : <p>Registration</p>}
            </div>
            <div className={classes.auth__form}>
                {status === 'login'? <LoginForm/> : <RegistrationForm/>}
            </div>
        </div>
    );
};

export default Auth;