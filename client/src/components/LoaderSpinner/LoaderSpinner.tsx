import React from 'react';
import classes from './loaderSpinner.module.scss';


const LoaderSpinner = () => {
    return (
        <div className={classes.spinner__container}>
            <span>Loading</span>
            <div className={classes.loading__spinner}>
            </div>
        </div>
    );
};

export default LoaderSpinner;