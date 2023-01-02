import { CartItem } from '../store/slices/cartSlice';

export const calcTotalItems = (items: CartItem[]) => {
  return items.reduce((sum:number, item: CartItem) => sum + item.count, 0)
};