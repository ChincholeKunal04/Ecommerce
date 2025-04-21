import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { HousePlug, SquareMenu, LogOut, ShoppingCart, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "../ui/dropdown-menu";
import { Avatar } from "../ui/avatar";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Label } from "../ui/label";

function MenuItems(){

    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams()

    function handelNavigate(getCurrentMenuItem){
        sessionStorage.removeItem('filters');
        const currentFilter = getCurrentMenuItem.id !== 'home' && getCurrentMenuItem.id !== 'products' &&  getCurrentMenuItem.id !== 'search'?
        {
            category : [getCurrentMenuItem.id]
        } : null

        sessionStorage.setItem('filters', JSON.stringify(currentFilter));

        location.pathname.includes('listing') && currentFilter !== null ? 
        setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`)) : 
        navigate(getCurrentMenuItem.path)
    }

    return (<nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-8 lg:flex-row">
        {
            shoppingViewHeaderMenuItems.map((menuItem) => (
                <Label 
                onClick={()=> handelNavigate(menuItem)}
                className="text-sm text-gray-600 font-bold hover:text-black cursor-pointer" 
                key={menuItem.id}>
                    {menuItem.label}
                </Label>
            ))
        }
    </nav>)
}

function HeaderRightContent(){

    const {user} = useSelector((stata) => stata.auth);
    const [openCartSheet, setOpenCartSheet] = useState(false);
    const {cartItems} = useSelector((state => state.shopCart))
    const navigate = useNavigate();
    const dispatch = useDispatch();

    function handelLogout(){
        dispatch(logoutUser())
    }

    // console.log(user?.id, "cartItems")

    useEffect(() => {
        dispatch(fetchCartItems(user?.id));
    }, [dispatch])

    // console.log(cartItems, "cartItems")

    return (
        <div className="flex lg:items-center lg:flex-row flex-col gap-4">
            <Sheet open={openCartSheet} onOpenChange={(isOpen) => setOpenCartSheet(isOpen)}
            >
                <Button
                onClick = {() => setOpenCartSheet(true)}
                varient='outline' 
                size='icon'
                className="relative"
                >
                    <ShoppingCart className="w-6 h-6"/>
                    <span className="font-extrabold absolute top-[-2px] right-[1px] text-sm">{cartItems?.items?.length || 0}</span>
                    <span className="sr-only">User cart</span>
                </Button>
                <UserCartWrapper
                setOpenCartSheet={setOpenCartSheet}
                cartItems={cartItems && cartItems?.items && cartItems.items.length > 0 ? cartItems.items : []}/>
            </Sheet>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className='bg-black flex items-center justify-center'>
                        <AvatarFallback className="bg-black text-white font-extrabold">
                            {user?.userName[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                    <DropdownMenuLabel>
                        Logged in as {user?.userName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate('/shop/account')}>
                        <User className="mr-2 h-4 w-4"/>
                        Account
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handelLogout}>
                        <LogOut className="mr-2 h-4 w-4"/>
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

function ShopHeader() {

    const {isAuthenticated} = useSelector((stata) => stata.auth);
    
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                <Link to='/shop/home'
                className="text-black hover:text-black flex items-center gap-2">
                    <HousePlug  className="h-6 w-6"/>
                    <span className="font-bold">Ecommerce</span>
                </Link>
                <Sheet>
                    <SheetTrigger asChild>
                        <Button varient="outline" size='icon' className='lg:hidden'>
                            <SquareMenu className="h-6 w-6" />
                            <span className="sr-only">Toggle header menu</span>
                        </Button>
                    </SheetTrigger>

                    <SheetContent side="left" className="w-full max-w-xs">
                        <MenuItems />
                        <HeaderRightContent />
                    </SheetContent>
                </Sheet>
                <div className="hidden lg:block">
                    <MenuItems />
                </div>
                 <div className="hidden lg:block">
                    <HeaderRightContent />
                </div> 
            </div>
        </header>
    );
}

export default ShopHeader;