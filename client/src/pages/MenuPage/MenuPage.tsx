import React from 'react';
import ProductCardList from '../../components/ProductCardList/ProductCardList';
import '../../styles/index.scss';
import classes from './menuPage.module.scss';
import ButtonCartForMobile from '../../components/ButtonCartForMobile/ButtonCartForMobile';

const MenuPage = () => {
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    }
    
    return (
        <div className={classes.menu__page}>
            <ButtonCartForMobile/>
            <ProductCardList/>
        </div>
    );
};

export default MenuPage;