import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { IProductRequest, IProductResponse, ProductServerResponse, ServerResponse } from "../models/IProduct";
import { RootState } from "../store";



export const productsApi = createApi({
    reducerPath: 'productsApi',
    baseQuery: fetchBaseQuery({ 
      baseUrl: 'https://pizza-mern-for-deploy.vercel.app/api',
   /*  refetchOnFocus: true, */
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
          headers.set('authorization', `Bearer ${token}`)
        }
      return headers
    }}),
    tagTypes: ['Products'],
    endpoints: (build) => ({
        getAllProducts: build.query<IProductResponse[], IProductResponse[]>({
            query: () => ({
                url: 'products',
            }), 
            transformResponse: (response: ServerResponse<IProductResponse>) => response.results
        }),
        getAllProductsPages: build.query<any, {page: number, limit:number, search:string}>({
          query: ({page, limit, search}) => ({
              url: `products?search=${search}&page=${page}&limit=${limit}`,
          }), 
          providesTags:['Products']
        }),

        getProductById: build.query<IProductResponse, string>({
          query: (id) => ({
            url: `products/${id}`,
          }), 
          transformResponse: (response: IProductResponse) => response,
          providesTags:['Products']
        }),

        addNewProduct: build.mutation<ProductServerResponse, FormData>({
          query: (credentials) => ({
            url: 'products/',
            method: 'POST',
            body: credentials
          }),
          transformResponse: (response: ProductServerResponse) => ({
            product: response.product,
            message: response.message
          }) ,
          invalidatesTags:['Products']
        }),

        updateProduct: build.mutation<ProductServerResponse, {id: string, formData: FormData}>({
          query: ({id, formData}) => ({
            url: `products/${id}`,
            method: 'PATCH',
            body: formData
          }),
          transformResponse: (response: ProductServerResponse) => ({
            product: response.product,
            message: response.message
          }),
          invalidatesTags:['Products']
        }),

        removeProduct:  build.mutation<null, string>({
          query: (id) => {
            return {
              url: `products/${id}`,
              method: 'DELETE',
            };
          },
          invalidatesTags:['Products']
        })
    })
})

export const { 
    useGetAllProductsQuery, 
    useGetAllProductsPagesQuery,
    useGetProductByIdQuery, 
    useAddNewProductMutation, 
    useUpdateProductMutation,
    useRemoveProductMutation
} = productsApi
