import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../store/slices/modalSlice';
import './myModal.scss';
import { IoMdClose } from 'react-icons/io';

interface modalProps {
    visible: boolean;
   
   /*  setVisible: (visible: boolean) => void, */
    children: React.ReactNode
}

const MyModal: FC<modalProps> = ({visible,/*  setVisible, */ children}) => {
    const dispatch = useDispatch();

    const handleMouseEvent = (e:React.MouseEvent<HTMLElement, MouseEvent>) => {
        if (e.type === "mousedown" && e.button === 0) {
            dispatch(closeModal())
        } 
    }

   /*  вохможно сделать закрытие модального окна на кнопки escape, tab придумать решение
   const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        console.log('ekeyDown', e.key)
    } */

 
    return (
       
        <div className={visible ? 'modal visible' : 'modal'} 
                /* onClick={(e)=> handleClick(e)} */ 
                onMouseDown={handleMouseEvent} 
                onMouseUp={handleMouseEvent} >
             {/* <div className={visible ? 'modal visible' : 'modal'} onClick={() => setVisible(false)}> */}
            <div className={visible ? 'modal__content visible' : 'modal__content'} /* onClick={e => e.stopPropagation()} */ onMouseDown={e => e.stopPropagation()}>
                {/* <button onClick={() => setVisible(false)}>X</button> */}
                <button className='modal__btn__close' onClick={() => dispatch(closeModal())}><IoMdClose size='1.5em'/></button>
                {children}
            </div>
        </div>
    );
};

export default MyModal;