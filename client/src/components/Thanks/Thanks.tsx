import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ICompletedOrderState } from '../../store/slices/orderSlice';
import { toUpperCaseFirstLitter } from '../../utils/toUpperCaseFirstLitter';
import classes from './thanks.module.scss';

export interface IOrderState {
    order: ICompletedOrderState
}

const Thanks: FC = () => {
    const {orderInfo, items, totalPrice} = useSelector((state: RootState) => state.order);
    /* const phoneNumber = orderInfo?.phone */

    console.log('items', items)

    return (
        <div className={classes.thanks__wrapper}>
            <div className={classes.thanks__container}>
                <h2>Thank you for your order</h2>
                <h4>Expect your delivery</h4>
                <div className={classes.orderInfo}>
                    <div><span>Client:</span> {orderInfo?.firstName}</div>
                    <div><span>Phone:</span> {orderInfo?.phone}</div>
                    <div>
                       <span>Delivery address:</span> {orderInfo?.address.city}, 
                        St.{orderInfo?.address.street} {orderInfo?.address.house} 
                    </div>
                    <div><span>Apartment: </span>{orderInfo?.address.entrance}/{orderInfo?.address.floor}/{orderInfo?.address.apartment}</div>
                    {orderInfo?.comment && <div><span>Comment:</span> {orderInfo.comment} </div>}
                </div>
                <div>
                    <h4>Your order</h4> 
                    <table>
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total price</th>
                        </tr> 
                        </thead>
                        <tbody>
                        {items?.map(item => 
                        <tr key={item.id+item.price}>
                            <td>
                                <div>
                                    <div className={classes.item__title}>{item.title}</div>
                                    <div className={classes.item__type}><span>{toUpperCaseFirstLitter(item.size)}</span> <span>{item.type}</span></div>
                                </div>
                            </td>
                            <td>{item.count}</td>
                            <td>{item.price}</td>
                            <td>{item.count*item.price}</td>
                        </tr>)}
                        </tbody>
                    </table>
                    
                    <div className={classes.payment}>For payment: {totalPrice} uah</div>
                </div>
            </div>
        </div>
    );
};

export default Thanks;