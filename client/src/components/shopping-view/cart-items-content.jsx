import React from 'react'
import { Button } from '../ui/button';
import { Minus, Plus, Trash } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCartItem, updateCartQuantity } from '@/store/shop/cart-slice';
import { useToast } from '@/hooks/use-toast';

const UserCartItemsContent = ( {cartItem} ) => {

  const dispatch = useDispatch();
  const {user} = useSelector((state) => state.auth)
  const {toast} = useToast();
  const {productList} = useSelector((state) => state.shopProducts);  

  const {cartItems} = useSelector((state) => state.shopCart)
  

  function handelCartItemDelete(getCartItem){
    dispatch(deleteCartItem({ userId : user?.id, productId : getCartItem?.productId }))
    .then((data) => {
      if(data?.payload?.success){
        toast({
          title : "Cart item is deleted"
        })
      }
    })
  }

  function handelUpdateQuantity(getCartItem, typeOfAction){
    if(typeOfAction === 'plus'){
      let getCartItems = cartItems.items || []

        if(getCartItems.length){
            const indexOfCurrentCartItem = getCartItems.findIndex(item => item.productId === getCartItem?.productId);

            const getCurrentProductIndex = productList.findIndex(product => product?._id === getCartItem?.productId)
            const getTotalStock = productList[getCurrentProductIndex].totalStock

            if(indexOfCurrentCartItem > -1){
                const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
                if(getQuantity + 1 > getTotalStock) {
                    toast({
                        title : `Only ${getTotalStock} quantity can be added for this item`,
                        variant : `destructive`
                    })
                    return;
                }
            } 
        }
    }

    dispatch(updateCartQuantity({
      userId : user?.id, 
      productId : getCartItem?.productId, 
      quantity : 
        typeOfAction === 'plus' ?
          getCartItem?.quantity + 1 : 
          getCartItem?.quantity - 1,
    })).then((data) => {
      if(data?.payload?.success){
        toast({
          title : "Cart item is updated"
        })
      }
    })
  }

  return (
    <div className='flex items-center space-x-4'>
      <img 
        src={cartItem?.image} 
        alt={cartItem?.title} 
        className='w-20 h-20 rounded object-cover'
        />
        <div className='flex-1'>
          <h3 className='font-extrabold'>{cartItem?.title}</h3>
          <div className='flex items-center gap-4 mt-1'>
            <Button 
            disabled={ cartItem.quantity === 1 }
            varient='outline' 
            size='icon' 
            className= "h-8 w-8 rounded-full"
            onClick={() => handelUpdateQuantity(cartItem, 'minus')} >
              <Minus className='w-4 h-4'/>
              <span className='sr-only'>Decrease</span>
            </Button>
            <span className='font-semibold'>{cartItem.quantity}</span>
            <Button 
            varient='outline' 
            size='icon' 
            className= "h-8 w-8 rounded-full" 
            onClick={() => handelUpdateQuantity(cartItem, 'plus')}>
              <Plus className='w-4 h-4'/>
              <span className='sr-only'>Increase</span>
            </Button>
          </div>
        </div>
        <div className='flex flex-col items-end'>
          <p className='semi-bols'>
            ${((cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) * cartItem?.quantity).toFixed(2)}
          </p>
          <Trash 
          onClick={() => handelCartItemDelete(cartItem)}
          className='curser-pointer mt-2' size={20}/>
        </div>
    </div>
  )
}

export default UserCartItemsContent;

