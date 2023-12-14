import React, {FC, useCallback, useState} from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import {useForm, useFieldArray} from 'react-hook-form';
import classes from './createProduct.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAddNewProductMutation } from '../../services/ProductsService';
import { MdDelete } from 'react-icons/md';
import { AiOutlinePlus} from 'react-icons/ai';
import { BiCloudUpload } from 'react-icons/bi';
import { TiArrowBack } from 'react-icons/ti';
import defaultImg from '../../assets/images/preview_img2.jpg';
import imageReader from '../../utils/imageReader';

import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import storage from '../../firebase';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface ICreateProductFormState {
    title: string,
    description: string,
    category: string,
    sizes: {
        size: string;
        price: number;
        value: number;
    }[];
    image: string
}

const CreateProduct: FC = () => {
    const navigate = useNavigate();
    const [imagePreview, setImagePreview] = useState<string>();
    const [imageName, setImageName] = useState('Choose file');

    const SUPPORTED_FORMATS = ['image/jpg', 'image/png', 'image/jpeg'];
    const [addNewProduct] = useAddNewProductMutation();
    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Title is required')
            .min(3, 'Title must be at least 3 characters')
            .max(35, 'Title must not exceed 35 characters'),
        description: Yup.string()
            .required('Description is required')
            .min(6, 'Description must be at least 6 characters')
            .max(100, 'Description must not exceed 100 characters'),
        category: Yup.string()
            .required('You must pick a category'),
        sizes: Yup.array().of( Yup.object().shape({
            size: Yup.string().required('size is required'),
            price: Yup.number()
              .required('price is required')
              .min(1, 'Price must be greater than 0'),
            value: Yup.number()
              .required('value is required')
              .min(1, 'Price must be greater than 0'),
        })),
        image:  Yup.mixed()
          .test("required", "image is required", value => value.length > 0)
          .test(
            "type",
            "We only support jpeg and png",
            value => {
              return !value || (value && SUPPORTED_FORMATS.includes(value[0]?.type))
            })
          .test("fileSize", "The file is too large", (file) => {
            return file && file[0]?.size <= 1024*1024*5;
          })
      }, [['title', 'title']]);

    const {register, handleSubmit, formState: { errors, isValid }, reset, control} = useForm<ICreateProductFormState>({
        mode:"all",
        defaultValues: {
            sizes: [{ size: "", price: 10, value: 10 }],
        },
        resolver: yupResolver(validationSchema)
    });

    const {onChange, ...registerParams} = register('image');

    const { fields, append, remove } = useFieldArray({
        name: "sizes",
        control
      });

    const createNewProduct = async (formState: FormData ) => {
        try {
            const response = await addNewProduct(formState).unwrap()
            toast.success(response.message)
        } catch (e: any) {
            toast.error(e.data.message)
        }
    }

    const onSubmit = (data: ICreateProductFormState) => {
        const formData = new FormData();
        const sizesArr = data.sizes;
       
        formData.append("image", data.image[0]);
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("category", data.category);

        sizesArr.forEach((obj, i) => {
          formData.append(`sizes[${i}][size]`, data.sizes[i].size);
          formData.append(`sizes[${i}][value]`, data.sizes[i].value as any);
          formData.append(`sizes[${i}][price]`, data.sizes[i].price as any);
        })
        createNewProduct(formData)
        reset();
        setImageName('Choose file');
        setImagePreview('');
    }

    const changeFileName = (fileName: string) => {
        let name = fileName.slice(0, fileName.lastIndexOf('.'));
        let ext = fileName.slice(fileName.lastIndexOf('.'));

        if (name.length > 20){
            name = name.slice(0, 6) + '...' + name.slice(name.length - 5)
        }

        fileName = name + ext;
        setImageName(fileName)
    }

    const onPictureChange = useCallback(async (event:React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.[0]) {
        const file = event.target.files?.[0];
        const pictureReader = await imageReader(file);
        setImagePreview(pictureReader as string);
        changeFileName(file.name)
      } else {
        setImagePreview('');
        setImageName('Choose file')
      }
    }, []);


    return (
      <div className={classes.form__wrapper}>
        <button className={classes.btn_back} onClick={()=> navigate('/admin')}>
          <TiArrowBack size='1.5em'/> 
          <span>Go admin page</span>
          </button>
        <p className={classes.form__title}>Create new product</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
          <div className={classes.custom__input__wrapper}>

            {imagePreview 
              ? <img src={imagePreview} width="200px" alt='previewImg' />
              : <img src={defaultImg} width="200px" alt='defaultImg'/> }

              {imagePreview
                ?<label htmlFor='file' ><span>{imageName}</span></label>
                :<label htmlFor='file' ><BiCloudUpload size='1.5em'/><span>Choose file</span></label> 
              }
          <input 
              {...registerParams}
              type="file" 
              id='file' 
              onChange={(event) => { 
                onPictureChange(event);
                onChange(event); // calling onChange returned from register 
              }} />
        </div>
        <div>{errors.image && <p>{errors.image?.message || "Error"}</p>}</div>
      
          </div>
          <div>
            <label>Title
                <input 
                    {...register("title")} 
                    placeholder='Enter title of product'
                    className={errors.title && classes.is_invalid }/>
            </label>
            <div>{errors.title && <p>{errors.title?.message || "Error"}</p>}</div>
            <label>Description
                <input 
                    {...register("description")} 
                    placeholder='Enter description of product'
                    className={errors.description && classes.is_invalid }/>
            </label>
            <div>{errors.description && <p>{errors.description?.message || "Error"}</p>}</div>
            <select {...register("category")} className={errors.category && classes.is_invalid}>
                <option value="">Category...</option>
                <option value="pizza">Pizza</option>
                <option value="drinks">Drinks</option>
                <option value="sides">Sides</option>
                <option value="dessert">Dessert</option>
            </select>
            <div>{errors.category && <p>{errors.category?.message || "Error"}</p>}</div>
            <div className={classes.sizes__wrapper}>
            <label>
                  <span>Size title:</span>
                  <span>Price(uah):</span>
                  <span> Size value:</span>
              </label>
            {fields.map((field, index) => {
          return (
            <div key={field.id} className={classes.sizes__wrapper}>
               
              <section className={"section"} key={field.id} >
                <input
                  placeholder="size"
                  {...register(`sizes.${index}.size` as const, {
                    //required: true
                  })}
                  className={errors?.sizes?.[index]?.size ? classes.is_invalid : ""}
                  defaultValue={field.size}
                />
                  <input
                    placeholder="price"
                    type="number"
                    {...register(`sizes.${index}.price` as const, {
                      valueAsNumber: true,
                      //required: true
                    })}
                    className={errors?.sizes?.[index]?.price ? classes.is_invalid : ""}
                    defaultValue={field.price}
                    min="1"
                  />
                <input
                  placeholder="value"
                  type="number"
                  min="1"
                  {...register(`sizes.${index}.value` as const, {
                    valueAsNumber: true,
                    //required: true
                  })}
                  className={errors?.sizes?.[index]?.value ? classes.is_invalid : ""}
                  defaultValue={field.value}
                />
                <button className={classes.btn_delete} type="button" onClick={() => remove(index)}>
                  <MdDelete size='1.2em' color='#E34724'/>
                </button>
              </section>
            </div>
          )
        })}</div>   
         <div>{errors.sizes && <p>{"Size title, price and value is required"}</p>}</div>
         <button
            className={classes.btn_add_size}
            type="button"
            onClick={() =>
              append({
                size: "",
                price: 0,
                value: 0
              })
            }>
            <AiOutlinePlus size='1.2em' color='black' style={{margin: '6px'}} /> Append new size
        </button>
        <input type="submit" disabled={!isValid} value='Create' className={classes.btn_submit}/>
        </div>
        </form>
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
        </div>
    );
};

export default CreateProduct;