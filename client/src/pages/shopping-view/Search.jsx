import ProductTile from '@/components/shopping-view/ProductTile';
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast';
import { getSearchResults, resetSearchResult } from '@/store/shop/search-slice';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import ProductDetails from '@/components/shopping-view/ProductDetails';
import { fetchProductDetails } from '@/store/shop/product-slice';


const Search = () => {
    const [keyword, setKeyword] = useState('');
    const [opendetailsDialogue, setOpendetailsDialogue] = useState(false)

    const [searchParams, setSearchParams] = useSearchParams()
    const dispatch = useDispatch();
    const {searchResult} = useSelector((state) => state.shopSearch)
    const {cartItems} = useSelector((state) => state.shopCart)
    const {productDetails} = useSelector((state) => state.shopProducts)
    const {user} = useSelector((state) => state.auth)
    const {toast} = useToast();

    useEffect(() => {
        if(keyword && keyword.trim() !== '' && keyword.trim().length > 3){
            setTimeout(() => {
                setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
                dispatch(getSearchResults(keyword))
            }, 1000) 
        }
        else{
            setSearchParams(new URLSearchParams(`?keyword=${keyword}`))
            dispatch(resetSearchResult())
        }
    }, [keyword])

    function handelAddToCart(getCurrentProductId, getTotalStock) {
        console.log(cartItems, 'ca')
    
        let getCartItems = cartItems.items || []
    
        if(getCartItems.length){
          const indexOfCurrentItem = getCartItems.findIndex(item => item.productId === getCurrentProductId);
          if(indexOfCurrentItem > -1){
            const getQuantity = getCartItems[indexOfCurrentItem].quantity;
            if(getQuantity + 1 > getTotalStock) {
              toast({
                title : `Only ${getQuantity} quantity can be added for this item`,
                variant : `destructive`
              })
    
              return;
            }
          } 
    
        }
    
        const payload = {
            userId: user?.id,
            productId: getCurrentProductId,
            quantity: 1
        };
    
        dispatch(addToCart(payload))
            .unwrap()
            .then((data) => {
              if(data?.success){
                dispatch(fetchCartItems(user?.id));
                toast({
                  title: "Product is added to cart"
                })
              }
            })
      }

    function handelGetProductsDetails(getCurrentProductId) {
        // console.log(getCurrentProductId);
        dispatch(fetchProductDetails(getCurrentProductId))
    }

    useEffect(() => {
        if(productDetails !== null){
            setOpendetailsDialogue(true);
        }
    }, [productDetails])

    console.log(searchResult, 'search')

    return (
        <div className='container mx-auto md:px-6 px-4 py-8'>
            <div className='flex justify-center mb-8'>
                <div className='w-full flex items-center'>
                    <Input 
                        value={keyword}
                        name = "keyword"
                        onChange={(event) => setKeyword(event.target.value)}
                        className = "py-6"
                        placeholder="Search Products..."
                    />
                </div>
            </div>
            {
                !searchResult.length ? 
                <h1 className='text-5xl font-extrabold'>No result found !</h1> : null
            }
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
                {
                    searchResult.map(item =>
                        <ProductTile
                        handelAddToCart={handelAddToCart}
                        handelGetProductsDetails={handelGetProductsDetails}
                        product={item}/> 
                    ) 
                }
            </div>
            <ProductDetails 
                open={opendetailsDialogue} 
                setOpen={setOpendetailsDialogue}
                productDetails={productDetails}>
            </ProductDetails>
        </div>
    )
}

export default Search
