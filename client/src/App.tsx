import React from 'react';
import {Route, Routes} from 'react-router-dom';
import MyModal from './components/UI/myModal/MyModal';
import './App.scss';
import HomePage from './pages/HomePage/HomePage';
import MenuPage from './pages/MenuPage/MenuPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import Layout from './components/Layout';
import Auth from './components/Auth/Auth';
import { useSelector} from 'react-redux';
import { RootState } from './store/index';
import OrderPage from './pages/OrderPage/OrderPage';
import AdminPage from './pages/AdminPage/AdminPage';
import CreateProduct from './components/CreateProduct/CreateProduct';
import ProductItemPage from './pages/ProductItemPage/ProductItemPage';
import EditProduct from './components/EditProduct/EditProduct';
import PrivateRoute from './hok/PrivateRoute';
import Thanks from './components/Thanks/Thanks';
import ToBeDonePage from './pages/ToBeDonePage/ToBeDonePage';

function App() {
  const { isOpen } = useSelector((state: RootState ) => state.modal);
  const { user } =  useSelector((state: RootState ) => state.auth);

  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout/>}>
            <Route index element={<HomePage/>}/>
            <Route path="home" element={<HomePage/>}/>
            <Route path="menu" element={<MenuPage/>}/>
            <Route path="menu/*" element={<MenuPage/>}/>
            <Route path="menu/products/:id" element={<ProductItemPage/>}/>
            <Route path="about" element={<ToBeDonePage/>}/>
            <Route path="profile" element={<ToBeDonePage/>}/>
            <Route path="history" element={<ToBeDonePage/>}/>
            <Route path="order" element={<OrderPage/>}/>
            <Route path="thanks" element={<Thanks/>}/>
            <Route path="product/:id" element={<ProductItemPage/>}/>
            <Route element={<PrivateRoute isAllowed={!!user && user.roles.includes('ADMIN')}/>}>
                  <Route path="admin" element={<AdminPage/>}/>
                  <Route path="addNewProduct" element={<CreateProduct/>}/>
                  <Route path="editor/:id" element={<EditProduct/>}/>
            </Route>
            <Route path="*" element={<NotFoundPage/>}/> 
          </Route>
        </Routes>

        <MyModal visible={isOpen}  children={<Auth/>}/>
      </div>
  );
}

export default App;
