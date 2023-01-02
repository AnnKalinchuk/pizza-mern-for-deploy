import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { addItem, CartItem, clearItems, minusItem, removeItem } from '../../store/slices/cartSlice';
import classes from './cart.module.scss';
import {AiOutlineMinus, AiOutlinePlus} from 'react-icons/ai';
import { IoMdClose } from 'react-icons/io';
import { toUpperCaseFirstLitter } from '../../utils/toUpperCaseFirstLitter';

const Cart = () => {
    const dispatch = useDispatch();
    
    const { items } = useSelector((state: RootState) => state.cart);
    
    const onClickRemove = (item:CartItem) => {
        if (window.confirm('Are you sure you want to delete product?')) {
          dispatch(removeItem(item));
        }
      };

    const onClickClearItems = () => {
      dispatch(clearItems())
    }

    const onClickMinus = (item:CartItem) => {
      if(item.count === 1) {
          dispatch(removeItem(item))
      }

      dispatch(minusItem(item));
      
        
      
    }

    const onClickAddItem = (item:CartItem) => {
      if(item) {
      dispatch(addItem(item));
    }
  }

    return (
        <div className={classes.cart__shop}>
            <div className={classes.cart__items__list}>
              {items?.map(item => 
              <div className={classes.cart__item} key={item.id+item.price}>
                <button className={classes.cart__item__btn__close} onClick={()=>onClickRemove(item)}><IoMdClose size='1.5em'/></button>
                <div className={classes.cart__item__content}>
                  <p className={classes.cart__item__content__title}>{item.title}</p>
                  <div className={classes.cart__item__content__info}>
                    <p className={classes.cart__item__content__info__description} >{item.description} </p>
                    <p className={classes.cart__item__content__info__size_and_type}>
                      <span>{toUpperCaseFirstLitter(item.size)}</span><span>{item.type}</span>
                    </p>
                  </div>
                <div className={classes.cart__item__btn__qty_price}>
                  <div className={classes.price}>
                        <div className={classes.price__block}>
                          <span>{item.price * item.count}</span>
                          <span>uah</span>
                        </div>
                    </div>
                  <div className={classes.qty}>
                      <button onClick={()=>onClickMinus(item)}><AiOutlineMinus size='1.5em'/></button>
                      <p className={classes.product__card__quantity__count}>
                        {item.count < 10 && <span>0</span>}{item.count}
                      </p>
                      <button onClick={()=>onClickAddItem(item)}><AiOutlinePlus size='1.5em'/></button>
                  </div>
                </div>
                </div>
              </div>
              )}
            </div>
        </div>
    );
};

export default Cart;