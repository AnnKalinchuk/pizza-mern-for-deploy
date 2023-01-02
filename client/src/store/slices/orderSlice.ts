import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { IOrderFormState } from "../../components/OrderForm/OrderForm";
import { CartItem } from "./cartSlice";


export interface ICompletedOrderState {
    orderInfo : IOrderFormState | null,
    items: CartItem[] | null,
    totalPrice: number,
}

const initialState: ICompletedOrderState = {
    orderInfo: null,
    items: null,
    totalPrice: 0,
}

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        checkout: (state, action:PayloadAction<ICompletedOrderState>) => {
            state.orderInfo = action.payload.orderInfo;
            state.items = action.payload.items;
            state.totalPrice = action.payload.totalPrice;
        },
        deleteOrder: (state) => {
            state.orderInfo = null;
            state.items = null;
            state.totalPrice = 0;
        }
    }
})

export const { checkout, deleteOrder } = orderSlice.actions;

export default orderSlice.reducer;