import React, { useState } from 'react';
import './carousel.scss';
import Slider, {Settings} from 'react-slick';
import slideFirst from '../../assets/images/slides/slide1.jpg';
import slideSecond from '../../assets/images/slides/slide2.jpg';
import slideThird from '../../assets/images/slides/slide3.jpg';
import slideFourth from '../../assets/images/slides/slide4.jpg';

const images = [slideFirst, slideSecond, slideThird, slideFourth]

const Carousel = () => {
    const [imageIndex, setImageIndex] = useState(0);
    const settings: Settings = {
        infinite: true,
        lazyLoad: "progressive",
        arrows:false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        centerPadding: '0',
        autoplay: true,
        dots: true,
        initialSlide: 0,
        beforeChange: (current, next) => setImageIndex(next)
      };
    return (
        <div className='slider-wrapper'>
        <Slider {...settings} className='slider-wrapper'> 
            {images.map((img, idx)  => (
                <img src={img} alt={img} key={idx}/>
            ))}
        </Slider>
        </div>
    );
};

export default Carousel;

