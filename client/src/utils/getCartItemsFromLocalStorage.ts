import { CartItem } from "../store/slices/cartSlice";
import { calcTotalPrice } from "./calcTotalPrice";
import { calcTotalItems } from "./calcTotalItems";

export const getCartItemsFromLocalStorage = () => {
    const data = localStorage.getItem('cart');
    const items = data ? JSON.parse(data) : [];
    const totalPrice = calcTotalPrice(items);
    const totalCountItems = calcTotalItems(items)

    return {
        items: items as CartItem[],
        totalPrice,
        totalCountItems
    };
}