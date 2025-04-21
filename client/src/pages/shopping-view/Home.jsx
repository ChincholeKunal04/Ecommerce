import { Button } from '@/components/ui/button';
import banner1 from '../../assets/banner1.webp';
import banner2 from '../../assets/banner2.webp';
import banner3 from '../../assets/banner3.webp';
import ProductDetails from "@/components/shopping-view/ProductDetails";
import { ChevronLeftIcon, ChevronRightIcon, ShirtIcon, CloudLightning, BabyIcon, WatchIcon, UmbrellaIcon, Shirt, WashingMachine, ShoppingBasket, Airplay, Images, Heater } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts } from '@/store/shop/product-slice';
import ProductTile from '@/components/shopping-view/ProductTile';
import { useNavigate } from 'react-router-dom';
import { fetchProductDetails } from '@/store/shop/product-slice';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { useToast } from '@/hooks/use-toast';
import { getFeatureImages } from '@/store/common';


const categoriesWithIcon = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
];

const brandsWithIcon = [
    { id: "nike", label: "Nike", icon: Shirt},
    { id: "adidas", label: "Adidas", icon: WashingMachine },
    { id: "puma", label: "Puma", icon: ShoppingBasket },
    { id: "levi", label: "Levi's", icon: Airplay  },
    { id: "zara", label: "Zara", icon: Images  },
    { id: "h&m", label: "H&M", icon: Heater  },
];

const ShoppingHome = () => {
  
    // const featureImageList = [banner1, banner2, banner3];
    const [currentSlide , setCurrentSlide] = useState(0);
    const dispatch = useDispatch();
    const { productList, productDetails} = useSelector(state => state.shopProducts);
    const navigate = useNavigate();
    const {toast} = useToast();
    const {user} = useSelector((state) => state.auth)

    const {featureImageList} = useSelector((state) => state.commonFeature)


    const [opendetailsDialogue, setOpendetailsDialogue] = useState(false);

    function handelNavigateToListingPage(getCurrentItem, section){
        sessionStorage.removeItem('filters');
        const currentFilter = {
            [section] : [getCurrentItem.id]
        }

        sessionStorage.setItem('filters', JSON.stringify(currentFilter));
        navigate('/shop/listing')
    };

    function handelGetProductsDetails(getCurrentProductId) {
    //   console.log(getCurrentProductId);
      dispatch(fetchProductDetails(getCurrentProductId))
    }

    function handelAddToCart(getCurrentProductId) {
        const payload = {
            userId: user?.id,
            productId: getCurrentProductId,
            quantity: 1
        };
    
        dispatch(
            addToCart(payload))
                .unwrap()
                .then((data) => {
                if(data?.success){
                    dispatch(fetchCartItems(user?.id));
                    toast({
                    title: "Product is added to cart"
                    })
                }
            }
        )
    }

    useEffect(() => {
        if(productDetails !== null){
          setOpendetailsDialogue(true);
        }
    }, [productDetails])

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide(previousSlide=> (previousSlide + 1) % featureImageList.length);
        }, 5000)

        return () => clearInterval(timer)
    },[featureImageList])

    useEffect(() => {
        dispatch(fetchAllFilteredProducts({
            filterParams : {}, 
            sortParams : 'price-lowtohigh'
        }));
    },[dispatch])
//   console.log(productList, 'productlist')

    useEffect(() => {
        dispatch(getFeatureImages())
    },[dispatch])


  return (
    <div className="flex flex-col min-h-screen">
        <div className="relative w-full h-[600px] overflow-hidden">
            {
                featureImageList && featureImageList.length > 0 ? featureImageList.map((slide, index) => (
                    <img 
                    src={slide?.image}
                    key={index}
                    className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'}  absolute top-0 keft-0 w-full h-full object-cover transition-opacity duration-1000`}
                    />
                )) : null
            }
            <Button onClick={() => setCurrentSlide(previousSlide=> (previousSlide - 1 + featureImageList.length) % featureImageList.length )}
             varient= 'outline' className='absolute top-1/2 left-4 transform translate-y-1/2 bg-black/80' size={20}>
                <ChevronLeftIcon className='w-4 h-4'/>
            </Button>
            <Button onClick={() => setCurrentSlide(previousSlide=> (previousSlide + 1) % featureImageList.length )}
             varient= 'outline' className='absolute top-1/2 right-4 transform translate-y-1/2 bg-black/80' size={20}>
                <ChevronRightIcon className='w-4 h-4'/>
            </Button>
        </div>

        <section className='py-12 bg-grey-50'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-8'>
                  Shop by Category
                </h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
                    {
                        categoriesWithIcon.map((categoryItem) => <Card 
                        onClick={() => handelNavigateToListingPage(categoryItem, 'category')}
                        className="curser-pointer hover:shadow-lg transition-shadow">
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <categoryItem.icon className='w-12 h-12 mb-4 text-primary'/>
                                <span className='font-bold'>
                                    {categoryItem.label}
                                </span>
                            </CardContent>
                        </Card>)
                    }
                </div>
            </div>
        </section>

        <section className='py-12 bg-grey-50'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-8'>
                  Shop by Brand
                </h2>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                    {
                        brandsWithIcon.map((brandItem) => <Card 
                        onClick={() => handelNavigateToListingPage(brandItem, 'brand')}
                        className="curser-pointer hover:shadow-lg transition-shadow">
                            <CardContent className="flex flex-col items-center justify-center p-6">
                                <brandItem.icon className='w-12 h-12 mb-4 text-primary'/>
                                <span className='font-bold'>
                                    {brandItem.label}
                                </span>
                            </CardContent>
                        </Card>)
                    }
                </div>
            </div>
        </section>

        <section className='py-12'>
            <div className='container mx-auto px-4'>
                <h2 className='text-3xl font-bold text-center mb-8'>
                  Feature Products
                </h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 mdLgrid-cols-3 lg:grid-cols-4 gap-6'>
                    {
                        productList && productList.length > 0 ?
                        productList.map((producItem) => <ProductTile 
                        handelGetProductsDetails={handelGetProductsDetails}
                        handelAddToCart={handelAddToCart}
                        product={producItem}/>)
                        : null
                    }
                </div>
            </div>
        </section>
        <ProductDetails 
            open={opendetailsDialogue} 
            setOpen={setOpendetailsDialogue}
            productDetails={productDetails}>
        </ProductDetails>
    </div>
  )
}

export default ShoppingHome
