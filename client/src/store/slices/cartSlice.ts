import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { calcTotalPrice } from "../../utils/calcTotalPrice"
import { calcTotalItems } from "../../utils/calcTotalItems"
import { getCartItemsFromLocalStorage } from "../../utils/getCartItemsFromLocalStorage"

export interface CartItem {
    id: string,
    title: string,
    description: string,
    size: string,
    type: string,
    imgUrl: string,
    price: number,
    count: number
}

export interface CartState {
    totalPrice: number,
    totalCountItems:number, 
    items: CartItem[]
}

const {items, totalPrice, totalCountItems} = getCartItemsFromLocalStorage();

const initialState: CartState = {
    totalPrice: totalPrice,
    totalCountItems : totalCountItems,
    items: items
}

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem(state, action: PayloadAction<CartItem>) {
            const findItem = state.items.find((obj) => {
                return obj.id === action.payload.id 
                        && obj.size === action.payload.size 
                        && obj.type === action.payload.type
            });
      
            if (findItem) {
              findItem.count++;
            } else {
              state.items.push({
                ...action.payload,
                count: 1,
              });
            }
      
            state.totalPrice = calcTotalPrice(state.items);
            state.totalCountItems = calcTotalItems(state.items);
        },
        minusItem(state, action: PayloadAction<CartItem>) {
            const findItem = state.items.find((obj) => {
                return obj.id === action.payload.id 
                        && obj.size === action.payload.size 
                        && obj.type === action.payload.type
            });
      
            if (findItem) {
              findItem.count--;
            }
      
            state.totalPrice = calcTotalPrice(state.items);
            state.totalCountItems = calcTotalItems(state.items);
        },
        removeItem(state, action: PayloadAction<CartItem>) {
            state.items = state.items.filter((obj) => {
                return obj.id !== action.payload.id 
                        || obj.size !== action.payload.size 
                        || obj.type !== action.payload.type
            });
            state.totalPrice = calcTotalPrice(state.items);
            state.totalCountItems = calcTotalItems(state.items);
        },
        clearItems(state) {
            state.items = [];
            state.totalPrice = 0;
            state.totalCountItems = 0;
        },
    }
})

export const { addItem , removeItem, minusItem, clearItems } = cartSlice.actions;

export default cartSlice.reducer;