import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import classes from "./orderPage.module.scss";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import {
  addItem,
  CartItem,
  minusItem,
  removeItem,
} from "../../store/slices/cartSlice";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { toUpperCaseFirstLitter } from "../../utils/toUpperCaseFirstLitter";
import OrderForm from "../../components/OrderForm/OrderForm";
import { useNavigate } from "react-router-dom";

import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import storage  from '../../firebase';

const OrderPage = () => {
  const navigate = useNavigate();
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);
  const [downloadUrlsForFirebaseOrder, setDownloadUrlsForFirebaseOrder] = useState<string[]>([]);

  //const serverApi = process.env.REACT_APP_SERVER_API;
  const serverApi = "http://localhost:5000";
  
  const dispatch = useDispatch();

  const onClickRemove = (item: CartItem) => {
    if (window.confirm("Are you sure you want to delete product?")) {
      dispatch(removeItem(item));
    }
  };

  const onClickMinus = (item: CartItem) => {
    if (item.count === 1) {
      dispatch(removeItem(item));
    }
    dispatch(minusItem(item));
  };

  const onClickAddItem = (item: CartItem) => {
    if (item) {
      dispatch(addItem(item));
    }
  };

  useEffect(() => {
    if (totalPrice === 0) {
      console.log("totalPrice in order page", totalPrice);
      navigate("/menu");
      return
    } 
    const imageUrls = items.map((item) => {
      const fileName = item.imgUrl.match(/\/([^\/]+)$/);
      return fileName ? `images/${fileName[1]}` : null;
    }).filter((url) => url !== null);

    Promise.all(imageUrls.map((url) => {
      if (url) {
        return getDownloadURL(ref(storage, url));
      }
    return Promise.resolve(null);
    }))
    .then((urls) => {
      const filteredUrls = urls.filter((url) => url !== null) as string[];
      setDownloadUrlsForFirebaseOrder(filteredUrls);
    })
    .catch((error) => {
      console.error('Error getting download URLs:', error);
    });
  }, [totalPrice, navigate, items]);

  

  return (
    <div className={classes.order__wrapper}>
      <div className={classes.order__container}>
        <div className={classes.order__checkout}>
          <h3>Checkout order</h3>
          <OrderForm />
        </div>
        <div className={classes.order__cart__wrapper}>
          <div className={classes.title}>Your order</div>
          <div className={classes.order__cart__inner}>
            <div className={classes.cart__items}>
              {items?.map((item, index) => (
                <div className={classes.cart__item} key={item.id + item.price}>
                  <button
                    className={classes.btn__close}
                    onClick={() => onClickRemove(item)}
                  >
                    <IoMdClose size="1.5em" />
                  </button>
                  <div className={classes.cart__item__content}>
                    <div className={classes.item__image__block}>
                      <img
                        src={downloadUrlsForFirebaseOrder[index]}
                        alt={`product_img_${index}`}
                      />
                    </div>
                    <div className={classes.item__info}>
                      <p className={classes.item__title}>{item.title}</p>
                      <div className={classes.item__info__description}>
                        <p className={classes.item__description}>
                          {item.description}{" "}
                        </p>
                        <p className={classes.item__size_and_type}>
                          <span>{toUpperCaseFirstLitter(item.size)}</span>
                          <span>{item.type}</span>
                        </p>
                        <div className={classes.cart__item__btn__qty_price}>
                          <div className={classes.price}>
                            <div className={classes.price__block}>
                              <span>{item.price * item.count}</span>
                              <span>uah</span>
                            </div>
                          </div>
                          <div className={classes.qty}>
                            <button onClick={() => onClickMinus(item)}>
                              <AiOutlineMinus size="1.5em" />
                            </button>
                            <p
                              className={classes.product__card__quantity__count}
                            >
                              {item.count < 10 && <span>0</span>}
                              {item.count}
                            </p>
                            <button onClick={() => onClickAddItem(item)}>
                              <AiOutlinePlus size="1.5em" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={classes.total__price}>
            <span>Price</span>
            <span>{totalPrice}.00 uah</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
