export interface Size {
    size: string,
    value: number,
    price: number
}

export interface IProductRequest {
    title: string,
    description: string,
    sizes: Size[],
    image: string,
   /*  image: File, */
    category: string
}

export interface IProductResponse {
    _id: string,
    title: string,
    description: string,
    sizes: Size[],
    imgUrl: string,
    category: string
}

export interface ProductServerResponse {
    product: IProductResponse,
    message: string
}

export interface ServerResponse<T> {
    results: T[];
}