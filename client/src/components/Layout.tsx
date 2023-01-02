import React from 'react';
import { Outlet} from 'react-router-dom';
import Footer from './Footer/Footer';
import Header from './Header/Header';
import classes from './layout.module.scss';


const Layout = () => {
   
    return (
        <div className={classes.layout__wrapper}>
            <Header/>
            <main>
                <Outlet/>
            </main>
            <Footer/>
        </div>
    );
};

export default Layout;