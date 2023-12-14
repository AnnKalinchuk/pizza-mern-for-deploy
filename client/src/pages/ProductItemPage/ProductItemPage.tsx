import { skipToken } from "@reduxjs/toolkit/dist/query";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";
import { useGetProductByIdQuery } from "../../services/ProductsService";
import classes from "./productItemPage.module.scss";
import { getDownloadURL, ref } from "@firebase/storage";
import storage from "../../firebase";

const ProductItemPage = () => {
  const { id } = useParams();
  const {
    isLoading,
    isError,
    data: productById,
  } = useGetProductByIdQuery(id ? id : skipToken);
  //const serverApi = process.env.REACT_APP_SERVER_API;
  const serverApi = "http://localhost:5000";
  
  const [downloadUrlForFirebase, setDownloadUrlForFirebase] = useState('');

  if (!productById) {
    return <LoaderSpinner />;
  }

  //добавила firebase
    if(productById) {
    const fileName = productById.imgUrl.match(/\/([^\/]+)$/);

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
    }  
  }
  //

  return (
    <div className={classes.product__item__wrapper}>
      <div className={classes.product__item__container}>
        {productById && (
          <div className={classes.product__item__inner}>
            <div className={classes.image}>
              <img
                src={downloadUrlForFirebase}
              />
            </div>
            <div className={classes.info__inner}>
              <div className={classes.info}>
                <h4>Title:</h4>
                <p>{productById?.title}</p>
              </div>
              <div className={classes.info}>
                <h4>Description:</h4>
                <p>{productById?.description}</p>
              </div>
              <div className={classes.info}>
                <h4>
                  Category:<span>{productById?.category}</span>
                </h4>
              </div>
              <div className={classes.info}>
                <table>
                  <thead>
                    <tr>
                      <th>Size:</th>
                      <th>Value:</th>
                      <th>Price:</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productById.sizes.map((item) => {
                      return (
                        <tr key={item.size}>
                          <td>{item.size}</td>
                          <td>
                            {item.value}{" "}
                            {productById.category === "drinks" ? "ml" : "g"}
                          </td>
                          <td>{item.price} uah</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductItemPage;
