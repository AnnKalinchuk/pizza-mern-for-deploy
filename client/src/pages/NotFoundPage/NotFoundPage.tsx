import React from 'react';
import { Link } from 'react-router-dom';
import classes from './notFoundPage.module.scss';

const NotFoundPage = () => {
    return (
        <div className={classes.error__page__wrapper}>
            <h1>404</h1>
            <h2>Page not found</h2>
            <p>Page is deprecated, deleted, or does not exist. Go <Link to="/">home</Link ></p>
        </div>
    );
};

export default NotFoundPage;