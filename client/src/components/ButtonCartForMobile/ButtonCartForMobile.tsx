import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import classes from './buttonCartForMobile.module.scss';
import { FaShoppingCart } from 'react-icons/fa';


const ButtonCartForMobile = () => {
    const navigate = useNavigate();
    const {totalPrice, totalCountItems} = useSelector((state: RootState) => state.cart)
    
    const checkoutClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation()
        navigate('/order', {replace: true});
    }
    return (
        <div className={classes.mobile__cart}  onClick={(e) => checkoutClick(e)}>
                <div className={classes.mobile__cart__wrapper}>
                <div className={`${classes.mobile__cart__button} ${totalCountItems < 1 && classes.disabled}`}>
                                <div className={classes.mobile__cart__icon__wrap}>
                                    <div className="cart__items__quantity">
                                        {totalCountItems < 10 && <span>0</span>}{totalCountItems}
                                    </div>
                                    <FaShoppingCart  size='1em'/>
                                </div>
                                {totalPrice && <div className={classes.mobile__cart__price}>{totalPrice}.00 uah</div>}
                </div>
                </div>
            </div>
    );
};

export default ButtonCartForMobile;