import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IProductResponse } from '../../models/IProduct';
import { useGetAllProductsQuery } from '../../services/ProductsService';
import ProductCard from '../ProductCard/ProductCard';
import ProductCardSkeleton from '../ProductCard/ProductCardSkeleton';
import classes from './productCardList.module.scss';

const ProductCardList = () => {
    const [category, setCategory] = useState('pizza');
    const {isLoading:ProductIsLoading, isError:ProductIsError, data:ProductData} = useGetAllProductsQuery([]/* ,{
        refetchOnFocus: true
    } */)
    const location = useLocation();
    const categoryFromLocation = location.pathname.replace('/menu/', '');


    useEffect(() => {
        if(categoryFromLocation === 'pizza' 
            || categoryFromLocation === 'drinks' 
            || categoryFromLocation === 'dessert' 
            || categoryFromLocation === 'sides' ) {
            setCategory(categoryFromLocation)
        } else {
            setCategory('pizza')
        }
    }, [categoryFromLocation])
    
    return (
        <div className={classes.product__card__list__wrapper}>
            <div className={classes.product__card__list__inner}>
                {ProductData?.filter((product:IProductResponse) => product.category === category)
                    .map((product:IProductResponse) => (<ProductCard key={product._id} product={product} types={[0,1]}/>))}
            
                {ProductIsLoading && Array(9).fill('')
                    .map((e, i) => <ProductCardSkeleton key={i}/>)}
            </div>
        </div>
    );
};

export default ProductCardList;