import React, { FC, useState, useEffect, useCallback } from "react";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useGetProductByIdQuery,
} from "../../services/ProductsService";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { TiArrowBack } from "react-icons/ti";
import { MdDelete } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { BiCloudUpload } from "react-icons/bi";
import defaultImg from "../../assets/images/preview_img2.jpg";
import { Size } from "../../models/IProduct";
import imageReader from "../../utils/imageReader";
import classes from "./editProduct.module.scss";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getDownloadURL, ref } from "@firebase/storage";
import storage from "../../firebase";

interface IEditProductFormState {
  title: string;
  description: string;
  category: string;
  sizes: Size[];
  image?: string;
}

const EditProduct: FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  //const serverApi = process.env.REACT_APP_SERVER_API;
  const serverApi = "http://localhost:5000";
  const [downloadUrlForFirebase, setDownloadUrlForFirebase] = useState('');

  const { isLoading, data: productById } = useGetProductByIdQuery(
    id ? id : skipToken
  );
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageName, setImageName] = useState("Update image");
  const SUPPORTED_FORMATS = ["image/jpg", "image/png", "image/jpeg"];
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const validationSchema = Yup.object().shape(
    {
      title: Yup.string()
        .required("Title is required")
        .min(3, "Title must be at least 3 characters")
        .max(35, "Title must not exceed 30 characters"),
      description: Yup.string()
        .required("Description is required")
        .min(6, "Description must be at least 6 characters")
        .max(100, "Description must not exceed 100 characters"),
      category: Yup.string().required("You must pick a category"),
      sizes: Yup.array().of(
        Yup.object().shape({
          size: Yup.string().required("size is required"),
          price: Yup.number()
            .required("price is required")
            .min(1, "Price must be greater than 0"),
          value: Yup.number()
            .required("value is required")
            .min(1, "Price must be greater than 0"),
        })
      ),
      image: Yup.mixed().when("image", (val, schema) => {
        if (val?.length > 0) {
          //if address exist then apply min max else not
          return (
            Yup.mixed()
              .test("required", "You need to provide a file", (file) => {
                // return file && file.size <-- u can use this if you don't want to allow empty files to be uploaded;
                if (file) {
                  return true;
                }
                return false;
              })
              .test("type", "We only support jpeg and png", (value) => {
                return (
                  !value ||
                  (value && SUPPORTED_FORMATS.includes(value[0]?.type))
                );
              })
              ///(value) => !value || (value && value[0].type === "image/jpeg") || (value && value[0].type === "image/png")) */
              .test("fileSize", "The file is too large", (file) => {
                //if u want to allow only certain file sizes
                return file && file[0]?.size <= 1024 * 1024 * 5;
              })
          );
        } else {
          return Yup.mixed().notRequired();
        }
      }),
    },
    [["image", "image"]]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    control,
  } = useForm<IEditProductFormState>({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });
  const { onChange, ...registerParams } = register("image");
  const { fields, append, remove } = useFieldArray({
    name: "sizes",
    control,
  });

  useEffect(() => {
    if (productById) {
      reset(productById);
    }
  }, [productById, reset]);

  const editProduct = async (formData: FormData) => {
    try {
      if (id) {
        const response = await updateProduct({ id, formData }).unwrap();
        toast.success(response.message);
      }
    } catch (e: any) {
      toast.error(e.data.message);
    }
  };

  const onSubmit = (data: IEditProductFormState) => {
    const formData = new FormData();
    const sizesArr = data.sizes;

    data.image && formData.append("image", data.image[0]);

    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("category", data.category);

    sizesArr.forEach((obj, i) => {
      formData.append(`sizes[${i}][size]`, data.sizes[i].size);
      formData.append(`sizes[${i}][value]`, data.sizes[i].value as any);
      formData.append(`sizes[${i}][price]`, data.sizes[i].price as any);
    });

    editProduct(formData);
  };

  const onPictureChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files?.[0]) {
        
        const file = event.target.files?.[0];
        const pictureReader = await imageReader(file);
        setImagePreview(pictureReader as string);
      } else {
        setImagePreview("");
      }
    },
    []
  );

  useEffect(() => {
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
        }  }
    if (!isLoading && productById) {
      setImagePreview(
        `${downloadUrlForFirebase}`
      );
    }
  }, [productById, isLoading, downloadUrlForFirebase]);

  return (
    <div className={classes.form__wrapper}>
      <button className={classes.btn_back} onClick={() => navigate("/admin")}>
        <TiArrowBack size="1.5em" />
        <span>Go admin page</span>
      </button>
      <p className={classes.form__title}>Edit Product Form</p>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <>
            <div className={classes.custom__input__wrapper}>
              {/* {imagePreview 
              ? <img src={imagePreview} width="200px" />
              : <img src={defaultImg} width="200px" /> }
          <label htmlFor='file' ><BiCloudUpload size='1.5em'/><span>{
            imagePreview? imageName : 'Choose file' 
          }</span></label> */}
              {imagePreview ? (
                <img src={imagePreview} width="200px" />
              ) : (
                <img src={defaultImg} width="200px" />
              )}
              <label htmlFor='file' ><BiCloudUpload size='1.5em'/><span>{
            imagePreview? imageName : 'Choose file' 
          }</span></label>
            {/*   {imagePreview ? (
                <label htmlFor="file">
                  <span>{imageName}</span>
                </label>
              ) : (
                <label htmlFor="file">
                  <BiCloudUpload size="1.5em" />
                  <span>Choose file</span>
                </label>
              )} */}
              <input
                {...registerParams}
                type="file"
                id="file"
                onChange={(event) => {
                  onPictureChange(event);
                  onChange(event);
                }}
              />
            </div>
            <div>
              {errors.image && <p>{errors.image?.message || "Error"}</p>}
            </div>
          </>
          <div>
            <label>
              Title
              <input
                {...register("title")}
                placeholder="Enter title of product"
                className={errors.title && classes.is_invalid}
              />
            </label>
            <div>
              {errors.title && <p>{errors.title?.message || "Error"}</p>}
            </div>
            <label>
              Description
              <input
                {...register("description")}
                placeholder="Enter description of product"
                className={errors.description && classes.is_invalid}
              />
            </label>
            <div>
              {errors.description && (
                <p>{errors.description?.message || "Error"}</p>
              )}
            </div>
            <select
              {...register("category")}
              className={errors.category && classes.is_invalid}
            >
              <option value="">Category...</option>
              <option value="pizza">Pizza</option>
              <option value="drinks">Drinks</option>
              <option value="sides">Sides</option>
              <option value="dessert">Dessert</option>
            </select>
            <div>
              {errors.category && <p>{errors.category?.message || "Error"}</p>}
            </div>
            <div className={classes.sizes__wrapper}>
              <label>
                <span>Size title:</span>
                <span>Price(uah):</span>
                <span> Size value:</span>
              </label>
              {fields.map((field, index) => {
                return (
                  <div key={field.id} className={classes.sizes__wrapper}>
                    <section className={"section"} key={field.id}>
                      <input
                        placeholder="size"
                        {...register(`sizes.${index}.size` as const, {
                          //required: true
                        })}
                        className={
                          errors?.sizes?.[index]?.size ? classes.is_invalid : ""
                        }
                        defaultValue={field.size}
                      />
                      <input
                        placeholder="price"
                        type="number"
                        {...register(`sizes.${index}.price` as const, {
                          valueAsNumber: true,
                          //required: true
                        })}
                        className={
                          errors?.sizes?.[index]?.price
                            ? classes.is_invalid
                            : ""
                        }
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
                        className={
                          errors?.sizes?.[index]?.value
                            ? classes.is_invalid
                            : ""
                        }
                        defaultValue={field.value}
                      />
                      <button
                        className={classes.btn_delete}
                        type="button"
                        onClick={() => remove(index)}
                      >
                        <MdDelete size="1.2em" color="#E34724" />
                      </button>
                    </section>
                  </div>
                );
              })}
            </div>
            <div>
              {errors.sizes && (
                <p>{"Size title, price and value is required"}</p>
              )}
            </div>
            <button
              className={classes.btn_add_size}
              type="button"
              onClick={() => append({ size: "", price: 0, value: 0 })}
            >
              <AiOutlinePlus
                size="1.2em"
                color="black"
                style={{ margin: "6px" }}
              />{" "}
              Append new size
            </button>
            <input
              type="submit"
              disabled={!isValid}
              value="Update"
              className={classes.btn_submit}
            />
          </div>
        </form>
      )}
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

export default EditProduct;
