import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import classes from './header.module.scss';
import { FaRegUser} from 'react-icons/fa';
import { FaShoppingCart } from 'react-icons/fa';
import { RiArrowDropDownLine } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { openModal } from '../../store/slices/modalSlice';
import MainMenu from '../MainMenu/MainMenu';
import logo from '../../assets/images/logo-pizzanna6.png';
import Cart from '../Cart/Cart';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout, selectCurrentUser } from '../../store/slices/authSlice';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const menuItems = ['Home', 'Menu', 'About'];

    const [userDropdownMenuIsVisible, setUserDropdownMenuIsVisible] = useState(false);
    const [isActiveMenuBurger, setIsActiveMenuBurger] = useState(false);
    const [cartIsOpen, setCartIsOpen ] = useState(false);
    const {items, totalPrice, totalCountItems} = useSelector((state: RootState) => state.cart)
    const user = useSelector(selectCurrentUser)

    useEffect(() => {
        if(totalCountItems === 0) {
            setCartIsOpen(false);
        } 
    },[totalCountItems])

    const onClickUserButton = () => {
        if(user) {
            setUserDropdownMenuIsVisible(!userDropdownMenuIsVisible)
        } else {
            dispatch(openModal())
        }
    }

    const checkoutClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        setCartIsOpen(false);
        navigate('/order'/* , {replace: true} */);
    }

    return (
        <header className={classes.header}>
            <div className={classes.header__content}>
                <div className={classes.header__content__top}>
                    <div className={classes.header__content__logo}>
                        <NavLink to="/home"><img src={logo} alt="Logo"/></NavLink>
                    </div>
                    <nav className={classes.header__content__nav}>
                        <ul>
                            <li><NavLink to="/home" >Home</NavLink></li>
                            <li><NavLink to="/menu" >Menu</NavLink></li>
                            <li><NavLink to="/about" >About</NavLink></li>
                        </ul>
                    </nav >
                    <div className={classes.header__content__icons}>
                       
                        <div className={classes.header__content__cart} >
                            <div className={`${classes.header__content__cart__button} ${totalCountItems < 1 && classes.disabled}`} 
                                onClick={() => setCartIsOpen(!cartIsOpen)}>
                                <div className={classes.header__content__cart__icon__wrap}>
                                    <div className="cart__items__quantity">
                                        {totalCountItems < 10 && <span>0</span>}{totalCountItems}
                                    </div>
                                    <FaShoppingCart  size='1em'/>
                                </div>
                                {totalPrice && <div className={classes.header__content__cart__price}>{totalPrice}.00 uah</div>}
                                <button className={classes.header__content__cart__button__order}
                                disabled={totalCountItems < 1 ? true: false} 
                                onClick={(e) => checkoutClick(e)}>Checkout</button>
                            </div>
                            {totalPrice>0 && cartIsOpen && <div className={classes.header__content__shop__cart}>
                                <Cart/>
                            </div>}
                        </div>
                    <div className={classes.header__content__icons__user}
                        onClick = {onClickUserButton}> 
                        <div className={classes.header__content__icons__user__button}>
                                <FaRegUser size='1.2em' color="#f8f8f8"/>
                            <div style={{fontSize: '18px', marginLeft: '6px'}}>
                                {user ? <span>{user.name}</span> : 'Sing in'}
                            </div>
                            {user && <span 
                                className={userDropdownMenuIsVisible ? classes.arrow_down : classes.arrow_up}>
                                <RiArrowDropDownLine size="2em"/>
                            </span>}
                        </div>
                            <div className={userDropdownMenuIsVisible 
                            ? `${classes.header__content__icons__user__dropdown} ${classes.dropdown__visible}`
                            : classes.header__content__icons__user__dropdown}>
                                <div className={classes.user__dropdown__info}>
                                        <div>
                                        <NavLink to="/history">History</NavLink>
                                        </div>
                                        <div>
                                        <NavLink to="/profile">Profile</NavLink>
                                        </div>
                                        {user?.roles.includes('ADMIN') && <div><NavLink to="/admin">Products table</NavLink></div>}
                                        <div>
                                            <p onClick={() => dispatch(logout())}>Sign out</p>
                                        </div>
                                </div>
                            </div>
                    </div>
                    </div>
                     <div className={isActiveMenuBurger
                        ? classes.header__content__menu__burger__activeMenu 
                        : classes.header__content__menu__burger } 
                        onClick={()=>setIsActiveMenuBurger(!isActiveMenuBurger)}>
                        <span/>
                        <span/>
                        <span/>
                    </div> 
                </div>
                <div className={classes.header__content__menu}>
                    <ul>
                        <li><NavLink to="menu/pizza" >Pizza</NavLink></li>
                        <li><NavLink to="menu/drinks" >Drinks</NavLink></li>
                        <li><NavLink to="menu/sides" >Sides</NavLink></li>
                        <li><NavLink to="menu/dessert" >Dessert</NavLink></li>
                    </ul>
                </div>
            </div>
            <MainMenu /* header={'Burger menu'} */ menuItems={menuItems} active={isActiveMenuBurger} setActive={setIsActiveMenuBurger} children />
        </header>
    );
};

export default Header;