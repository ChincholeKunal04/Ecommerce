import Filter from "@/components/shopping-view/Filter";
import ProductDetails from "@/components/shopping-view/ProductDetails";
import ProductTile from "@/components/shopping-view/ProductTile";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchAllFilteredProducts, fetchProductDetails } from "@/store/shop/product-slice";
import { MoveVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

function createSearchParamsHelper(filterParams){
  const queryParams = [];

  for(const [key, value] of Object.entries(filterParams)){
    if(Array.isArray(value) && value.length > 0){
      const paramValue = value.join(',');

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join('&');
}


const ShopListing = () => {

  //fetch list of products
  const dispatch = useDispatch();
  const {productList, productDetails} = useSelector((state) => state.shopProducts);  
  const {cartItems} = useSelector((state) => state.shopCart)
  const {user} = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const {toast} = useToast();

  const categorySearchParams = searchParams.get('category')

  const [opendetailsDialogue, setOpendetailsDialogue] = useState(false);

  function handelSort(value) {
    console.log(value)
    setSort(value);
  }

  function handelFilter(getSectionId, getCurrentOption) {
    console.log(getSectionId, getCurrentOption);

    let cpyFilters = {...filters};
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId)

    if(indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption]
      }
    } 
    else{
      const indexOfCurrentSection = cpyFilters[getSectionId].indexOf(getCurrentOption);

      if(indexOfCurrentSection === -1) cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentSection, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem('filters', JSON.stringify(cpyFilters));
  }

  function handelGetProductsDetails(getCurrentProductId) {
    // console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId))
  }

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

  useEffect(() => { 
    setSort('price-lowtohigh');
    setFilters(JSON.parse(sessionStorage.getItem('filters')) || {})
  }, [categorySearchParams])

  useEffect(() => {
    if(filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString))
    }
  }, [filters])

  useEffect(() => {
    if(filters !== null && sort !== null)
    dispatch
      (fetchAllFilteredProducts({filterParams : filters, sortParams : sort})
    );
  }, [dispatch, sort, filters])

  useEffect(() => {
    if(productDetails !== null){
      setOpendetailsDialogue(true);
    }
  }, [productDetails])

  return (
    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6">
        <Filter filters={filters} handelFilter={handelFilter}/>
        <div className="bg-background w-full rounded-lg shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="text-lg font-extrabold">All Products</h2>
                <div className="flex items-center gap-5">
                  <span className="text-muted-foreground">{productList.length} products</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button varient="outline" size="sm" className="flex items-center gap-1">
                        <MoveVertical className="h-4 w-4"/>
                        <span>Sort by</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      <DropdownMenuRadioGroup value={sort} onValueChange={handelSort}>
                        {
                          sortOptions.map(sortItems => <DropdownMenuRadioItem 
                            key={sortItems.id}
                            value={sortItems.id}
                          >
                            {sortItems.label}
                          </DropdownMenuRadioItem>)
                        }
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
              {
                productList && productList.length > 0 ?
                  productList.map(product => 
                    <ProductTile 
                        handelGetProductsDetails={handelGetProductsDetails}
                        key={product.key} 
                        product={product}
                        handelAddToCart={handelAddToCart}
                        >
                    </ProductTile>) 
                    : null
              }
            </div> 
        </div>
        <ProductDetails 
          open={opendetailsDialogue} 
          setOpen={setOpendetailsDialogue}
          productDetails={productDetails}>
        </ProductDetails>
    </div>
  );
};

export default ShopListing;
