import React, { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IProductResponse, Size } from "../../models/IProduct";
import { useDispatch } from "react-redux";
import classes from "./productCard.module.scss";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import { addItem, minusItem, removeItem } from "../../store/slices/cartSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { toUpperCaseFirstLitter } from "../../utils/toUpperCaseFirstLitter";

import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import storage  from '../../firebase';

const typeNames = ["Standard crust", "Philadelphia"];

interface PizzaBlockProps {
  product: IProductResponse;
  types: number[];
}

const ProductCard: FC<PizzaBlockProps> = ({ product, types }) => {
  //const serverApi = process.env.REACT_APP_SERVER_API;
  const serverApi = "http://localhost:5000";
  const [downloadUrlForFirebase, setDownloadUrlForFirebase] = useState('');

  const dispatch = useDispatch();

  const [totalCostItem, setTotalCostItem] = useState(0);
  const [isSelectedSize, setIsSelectedSize] = useState<Size>(product.sizes[0]);
  const [isSelectedCrust, setIsSelectedCrust] = useState<number>(0);
  const [isActiveButtonSize, setIsActiveButtonSize] = useState(0);
  const [isActiveButtonCrust, setIsActiveButtonCrust] = useState(0);
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);

  

  const productType = product.category === "pizza" ? typeNames[isSelectedCrust] : "";
  const cartItem = items.find((item) => {
    return (
      item.id === product._id &&
      item.size === isSelectedSize.size &&
      item.type === productType
    );
  });

  const countItem = cartItem ? cartItem.count : 0;

  const onClickAddItem = () => {
    const item = {
      id: product._id,
      title: product.title,
      price: totalCostItem,
      description: product.description,
      imgUrl: product.imgUrl,
      type: productType,
      size: isSelectedSize.size,
      count: 0,
    };

    dispatch(addItem(item));
  };

  const onClickMinus = () => {
    if (cartItem) {
      if (cartItem.count === 1) {
        dispatch(removeItem(cartItem));
      }

      dispatch(minusItem(cartItem));
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLElement>, size: Size) => {
    e.preventDefault();
    setIsActiveButtonSize(+e.currentTarget.id);
    setIsSelectedSize(size);
  };

  const handleClickCrust = (e: React.MouseEvent<HTMLElement>, num: number) => {
    e.preventDefault();
    setIsActiveButtonCrust(+e.currentTarget.id);
    setIsSelectedCrust(num);
  };

  const calcTotalPrice = () => {
    const price = isSelectedSize.price + isSelectedCrust;

    setTotalCostItem(price);
  };

  useEffect(() => {
    calcTotalPrice();
  }, [totalCostItem, isSelectedSize, isSelectedCrust]);

  useEffect(() => {
    if(product) {
    const fileName = product.imgUrl.match(/\/([^\/]+)$/);

    if(fileName) {
      const imageUrl = `images/${fileName[1]}`;
      const storageRef = ref(storage, imageUrl);
   
   

    getDownloadURL(storageRef)
      .then((url) => {
        setDownloadUrlForFirebase(url);
      })
      .catch((error) => {
        console.error('Error getting download URL:', error);
      });
    }  }
  }, [product]);

  return (
    <div className={classes.product__card}>
      <div className={classes.product__card__image__block}>
        <div className={classes.image}>
           <img
            src={downloadUrlForFirebase}
          />
        </div>
        <div className={classes.weight}>
          {product.sizes[isActiveButtonSize].value}
          {product.category === "drinks" ? <span>ml</span> : <span>*g</span>}
        </div>
        {countItem > 0 && (
          <div
            className={classes.weight}
            style={{ left: "10px", width: "22px" }}
          >
            <FaShoppingCart />
          </div>
        )}
      </div>
      <div className={classes.product__card__description}>
        <div className={classes.title}>
          <Link className={classes.title__text} to={`products/${product._id}`}>
            {product.title}
          </Link>
        </div>
        <div className={classes.description}>
          <span>{product.description}</span>
        </div>
      </div>
      <div className={classes.product__card__details}>
        <div className={classes.product__card__details__info}>
          <div
            className={classes.sizes}
            style={{ display: product.category === "pizza" ? "grid" : "flex" }}
          >
            {product.sizes.map((elem, i) => (
              <button
                id={`${i}`}
                key={i}
                className={
                  isActiveButtonSize === i
                    ? classes.button__active
                    : classes.button
                }
                onClick={(e) => handleClick(e, elem)}
              >
                {toUpperCaseFirstLitter(elem.size)}
              </button>
            ))}
          </div>
          {product?.category === "pizza" && (
            <div className={classes.crust}>
              <button
                id="0"
                className={
                  isActiveButtonCrust === 0
                    ? classes.button__active
                    : classes.button
                }
                onClick={(e) => handleClickCrust(e, 0)}
              >
                {typeNames[0]}
              </button>
              <button
                id="1"
                className={
                  isActiveButtonCrust === 1
                    ? classes.button__active
                    : classes.button
                }
                onClick={(e) => handleClickCrust(e, 1)}
              >
                {typeNames[1]}
              </button>
            </div>
          )}
        </div>

        <div className={classes.product__card__price__row}>
          <div className={classes.price}>
            <div className={classes.price__block}>
              {totalCostItem && <span>{totalCostItem}</span>}
              <span>uah</span>
            </div>
          </div>
          <div className={classes.product__card__btn__wrap}>
            {countItem > 0 ? (
              <div className={classes.product__card__quantity}>
                <button onClick={onClickMinus}>
                  <AiOutlineMinus size="1.2em" />
                </button>
                <p className={classes.product__card__quantity__count}>
                  {countItem < 10 && <span>0</span>}
                  {countItem}
                </p>
                <button onClick={onClickAddItem}>
                  <AiOutlinePlus size="1.2em" />
                </button>
              </div>
            ) : (
              <button
                className={classes.product__card__btn_red}
                onClick={onClickAddItem}
              >
                To cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
