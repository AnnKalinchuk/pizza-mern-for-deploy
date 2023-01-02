import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetAllProductsPagesQuery } from '../../services/ProductsService';
import Search from '../../components/Search/Search';
import classes from './adminPage.module.scss';
import Pagination from '../../components/Pagination/Pagination';
import ProductTable from '../../components/ProductTable/ProductTable';
import {AiOutlinePlus} from 'react-icons/ai';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderSpinner from '../../components/LoaderSpinner/LoaderSpinner';


const AdminPage = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [totalCount, setTotalCount] = useState(0);
    const [totalPages,  setTotalPages] = useState(0); 
    const [searchValue, setSearchValue] = useState('');
  
    const onChangePage = (page: number) => {
        setCurrentPage(page);
    };

    const {data, isLoading, isError} = useGetAllProductsPagesQuery({page:currentPage, limit, search:searchValue})
    
    useEffect(() => {
        if(data) {
             setTotalCount(data.totalCount);
             setTotalPages(data.totalPages);
        }
    }, [data])

    useEffect(()=>{
        if(searchValue) {
            onChangePage(1)
        }
    }, [searchValue])

    if (isLoading) {
        return <div style={{display:'flex',justifyContent:'center', alignItems:'center', height: '80vh'}}><LoaderSpinner/></div>;
    }
      
    return (
        <div className={classes.admin__wrapper}> 
            <div className={classes.admin__inner}>
                <div className={classes.admin__top} >
                    <Search searchValue={searchValue} setSearchValue={setSearchValue}/> 
                    <div className={classes.add_button}>
                        <button onClick={()=>navigate('/addNewProduct')}><AiOutlinePlus size='1.2em'/><span>Add product</span></button> 
                    </div>
                </div>
                {data && <div className={classes.product__table__container}>
                    <ProductTable productsData={data?.results}/>
                {totalPages > 0 && 
                    <Pagination currentPage={currentPage} 
                                onChangePage={onChangePage} 
                                pageCount={totalPages} />
                }
                </div>}
            </div>
           <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </div>
        );
};

export default AdminPage;