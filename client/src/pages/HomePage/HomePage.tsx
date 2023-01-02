import React, { useEffect, useState } from "react";
import Carousel from "../../components/Carousel/Carousel";
import carImage from '../../assets/images/delivery.png';
import pizzaImage from '../../assets/images/logo-pizzanna1.png';
import cupImage from '../../assets/images/cup-star.png';
import restaurantsImage from '../../assets/images/restaurants-Pizza.png';
import classes from './homePage.module.scss';
import ButtonCartForMobile from "../../components/ButtonCartForMobile/ButtonCartForMobile";
import LoaderSpinner from "../../components/LoaderSpinner/LoaderSpinner";


const HomePage = () => {
  const [isReadyComponent, setIsReadyComponent] = useState(false)

  useEffect(() =>{
    window.scrollTo(0,0)
  }, [])

  useEffect(() => {
    setIsReadyComponent(true)
  }, []);

  return (
    <>
    {isReadyComponent 
      ? <div className={classes.home__wrapper}>
      <ButtonCartForMobile/>
      <Carousel data-carousel='123'/>
      <section className={classes.info}>
      <div className={classes.info__item}>
          <div>
            <span className={classes.title}>About "PIZZAnna"</span>
            <p className={classes.text}>"PIZZAnna"- is the largest and fastest growing restaurant chain of modern Italian cuisine.</p>
          </div>
          <div className={classes.image} >
            <img src={pizzaImage} alt='pizza'/>
          </div>
          
        </div>
        <div className={classes.info__item}>
          <div>
            <span className={classes.title}>Delivery and payment</span>
            <p className={classes.text}>
					    We have free delivery. Minimal order sum is 250 UAH. 
              "PIZZAnna" - best delivery in your city!
            </p>
          </div>
          <div className={classes.image}>
            <img src={carImage} alt='car'/>
          </div>
        </div>
        <div className={classes.info__item}>
          <div>
            <span className={classes.title}>Restaurants</span>
            <p className={classes.text}>All about PIZZAnna`s restourants chain.</p>
          </div>
          <div className={classes.image}>
            <img src={restaurantsImage} alt='restaurants'/>
          </div>
          
        </div>
        <div className={classes.info__item}>
          <div>
            <span className={classes.title}>Quality control</span>
            <p className={classes.text}>
					      Quality control covers all the stages- 
                from the purchase to the supplying and processing.
            </p>
          </div>
          <div className={classes.image}>
            <img src={cupImage} alt='cup'/>
          </div>
          
        </div>
        
      </section>
    </div>
    : <LoaderSpinner/>}
    </>
    
  );
};

export default HomePage;


