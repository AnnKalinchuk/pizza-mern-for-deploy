import React, { FC, useMemo } from 'react';
import classes from './productTable.module.scss';
import { useTable } from 'react-table';
import { COLUMNS } from '../../utils/columns';
import { MdEdit, MdDelete } from 'react-icons/md';
import { FaRegEye } from 'react-icons/fa';
import { useRemoveProductMutation } from '../../services/ProductsService';
import { useNavigate } from 'react-router-dom';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';

const ProductTable: FC<any> = ({productsData}) => {

    const [removeProduct ] = useRemoveProductMutation();
    const navigate = useNavigate();

    const columns = useMemo(() => COLUMNS, [COLUMNS])
    const data = useMemo(() => productsData, [productsData])

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({columns , data})

    const  onClickRemove = async (id: any) => {
      console.log('type id', typeof id)
      if (window.confirm('Are you sure you want to delete product?')) {
        try {
          const response = await removeProduct(id);
          if(response) {
            toast.success('Product was deleted')
          } 
        } catch (e:any) {
          toast.error(e.message)
        }
        
      }
    };

    const  onClickUpdate = (id:any) => {
        navigate(`/editor/${id}`)
    };

    return (
      <>
        <table {...getTableProps()} className={classes.table}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers?.map(column => (
                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
              <th>Actions</th>
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {!productsData.length && <tr>
            <td colSpan={7}><div>Product not found</div></td>
            
          </tr>}
          {rows?.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
                <td>
                  <div className={classes.table__buttons} >
                     <button style={{marginRight:'3px'}} >
                        <MdEdit size='1.2em' color='#FFC107' 
                        onClick={()=> onClickUpdate(row.original._id)}/>
                    </button>
                    <Link to={`/product/${row.original._id}`}  style={{marginRight:'3px'}}>
                        <FaRegEye size='1.2em' color='#092e72' />
                    </Link>
                    <button>
                        <MdDelete size='1.2em' color='#E34724' 
                        onClick={()=> onClickRemove(row.original._id)}/>
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
        
        </table>
        <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    );
};

export default ProductTable;