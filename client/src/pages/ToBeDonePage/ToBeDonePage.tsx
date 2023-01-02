import React from 'react';
import toBeDoneImg from '../../assets/images/toBeDone.png';
import classes from './toBeDonePage.module.scss';

const ToBeDonePage = () => {
    return (
        <div className={classes.tobedone__wrapper} >
            <img src={toBeDoneImg} alt='tobedone'/> 
        </div>
    );
};

export default ToBeDonePage;