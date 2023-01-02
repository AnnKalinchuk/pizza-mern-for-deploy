import { yupResolver } from '@hookform/resolvers/yup';
import React from 'react';
import classes from './orderForm.module.scss';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';
import { useForm, Controller } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { checkout } from '../../store/slices/orderSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearItems } from '../../store/slices/cartSlice';

export interface Address {
    city: string,
    street: string,
    house: string,
    apartment: string,
    entrance: string,
    floor: string,
}

export interface IOrderFormState {
    firstName: string,
    phone: string,
    email: string,
    address: Address,
    comment?: string
}

const OrderForm = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { items, totalPrice } = useSelector((state: RootState) => state.cart);

    const validatePhone = (phoneNumber: string) => {
      phoneNumber = phoneNumber.replace(/[\s\-]/g, '');
      return phoneNumber.match(/^((\+?3)?8)?((0\(\d{2}\)?)|(\(0\d{2}\))|(0\d{2}))\d{7}$/) != null;
    }
    
    const validationSchema = Yup.object().shape({
        firstName: Yup.string()
            .required('FirstName is required'),
        phone: Yup.string()
            .required('Phone is required')
            .test('phone', 'Phone number is not valid', (val) => {
              if(val) {
                return validatePhone(val)
              } else return false
            }),  
        email: Yup.string()
            .required('Email is required')
            .email('Email is invalid'),
        address: Yup.object().shape({
            city: Yup.string().required('city is required'),
            street: Yup.string().required('street is required'),
            house: Yup.string().required('house is required'),
            apartment: Yup.string().required('apartment is required'),
            entrance: Yup.string().required('entrance is required'),
            floor: Yup.string().required('floor is required'),
        }),
        comment: Yup.string().when("comment", (val, schema) => {
            if(val?.length > 0) { 
                return Yup.mixed().required('comment is required')
            } else {
                return Yup.mixed().notRequired();
            }
        })
      }, [["comment", "comment"]]);

    const {register, handleSubmit, formState: { errors, isValid }, reset, control} = useForm<IOrderFormState>({
        mode:'onTouched',
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = (data: IOrderFormState) => {
        const newOrder = {
          orderInfo: {
                ...data,
                phone: data.phone.replace(/[^+\d]/g, ''),
                comments: data.comment || ''
          },
          totalPrice,
          items
        }

        dispatch(checkout(newOrder))
        dispatch(clearItems())

        navigate('/thanks')
        reset();
      }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={classes.order__form}>
          <div>
            <span>Contacts:</span>
            <div className={classes.contacts__wrapper}>
            <div>
              <label>First name</label>
              <input
                    {...register("firstName")} 
                    placeholder='First name'
                    className={errors.firstName && classes.is_invalid }/>
              <div>{errors.firstName && <p>{errors.firstName?.message || "Error"}</p>}</div>
            </div> 
            <div>
              <label>Phone</label>
              <Controller
                  control={control}
                  name="phone"
                  render={({ field: { onChange, onBlur, ref } }) => (
                <InputMask
                  mask="+380(99)-999-99-99"
                  onBlur={onBlur}
                  onChange={onChange}
                  inputRef={ref}
                  placeholder='Phone'/>)}/>
              <div>{errors.phone && <p>{errors.phone?.message || "Error"}</p>}</div>
            </div>
            <div>
              <label>Email</label>
              <input 
                  {...register("email")} 
                  placeholder='Email'
                  className={errors.email && classes.is_invalid }/>
              <div>{errors.email && <p>{errors.email?.message || "Error"}</p>}</div>
            </div>
            </div>
            <span>Address:</span>
            <div className={classes.address__wrapper}>
            <div>
              <label>City  </label>
              <input 
                {...register("address.city")} 
                placeholder='City'
                className={errors.address?.city && classes.is_invalid }/>
              <div>{errors.address?.city && <p>{errors.address?.city.message || "Error"}</p>}</div>
            </div>
            <div>
              <label>Street</label>
              <input 
                {...register("address.street")} 
                placeholder='Street'
                className={errors.address?.street && classes.is_invalid }/>
              <div>{errors.address?.street && <p>{errors.address?.street.message || "Error"}</p>}</div>
            </div>
            <div>
              <label>House</label>
              <input 
                {...register("address.house")} 
                placeholder='House'
                className={errors.address?.house && classes.is_invalid }/>
              <div>{errors.address?.house && <p>{errors.address?.house.message || "Error"}</p>}</div>
            </div>
            <div>
              <label>Apartment</label>
              <input 
                {...register("address.apartment")} 
                placeholder='Apartment'
                className={errors.address?.apartment && classes.is_invalid }/>
              <div>{errors.address?.apartment && <p>{errors.address?.apartment.message || "Error"}</p>}</div>
            </div>
            <div>
              <label>Entrance</label>
              <input 
                {...register("address.entrance")} 
                placeholder='Entrance'
                className={errors.address?.entrance && classes.is_invalid }/>
              <div>{errors.address?.entrance && <p>{errors.address?.entrance.message || "Error"}</p>}</div>
            </div>
            <div>
              <label>Floor</label>
              <input 
                {...register("address.floor")} 
                placeholder='Floor'
                className={errors.address?.floor && classes.is_invalid }/>
              <div>{errors.address?.floor && <p>{errors.address?.floor.message || "Error"}</p>}</div>
            </div>
        </div>
        <div>
          <label>Comment</label>
          <textarea 
            {...register("comment")} 
            placeholder='Comment'
            className={errors.comment && classes.is_invalid }/>
          <div>{errors.comment && <p>{errors.comment?.message || "Error"}</p>}</div>
        </div>
        <div className={classes.total__price}>Total {totalPrice}.00 uah</div>
        <div className={classes.btn_wrapper}>
          <input type="submit" disabled={!isValid} value='Checkout' className={classes.btn_submit}/>
        </div>
        </div>
        </form>
    );
};

export default OrderForm;