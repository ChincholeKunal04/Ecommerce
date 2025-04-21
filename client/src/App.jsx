import { Route, Routes } from "react-router-dom"
import AuthLayout from "./components/auth/Layout"
import AuthLogin from "./pages/auth/Login"
import AuthRegister from "./pages/auth/Register"
import AdminLayout from "./components/admin-view/Layout"
import AdminDashboard from "./pages/admin-view/Dashboard"
import AdminProducts from "./pages/admin-view/Products"
import AdminOrders from "./pages/admin-view/Orders"
import AdminFeatures from "./pages/admin-view/Features"
import ShopLayout from "./components/shopping-view/Layout"
import NotFound from "./pages/not-found/Index"
import ShoppingHome from "./pages/shopping-view/Home"
import ShopListing from "./pages/shopping-view/Listing"
import ShopCheckout from "./pages/shopping-view/Checkout"
import ShopAccount from "./pages/shopping-view/Account"
import CheckAuth from "./components/common/CheckAuth"
import UnAuthPage from "./pages/unauth-page/Index"
import PaypalReturn from "./pages/shopping-view/PaypalReturn"
import PaymentSuccess from "./pages/shopping-view/PaymentSuccess"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { checkAuth } from "./store/auth-slice"
import { Skeleton } from "@/components/ui/skeleton"
import Search from "./pages/shopping-view/Search"



function App() {

  const {isAuthenticated, user, isLoading} = useSelector((state) => state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch])

  if(isLoading){
    return <Skeleton className="w-[800px]  h-[600px]" />
  }

  // console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">

      <Routes >
        <Route 
          path="/"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user} >
            </CheckAuth>
          }
        />
        <Route path="/auth" 
          element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
            <AuthLayout />
          </CheckAuth>
          }>
          <Route path="login" element={<AuthLogin />}/>
          <Route path="register" element={<AuthRegister />}/>
        </Route>

        <Route path="/admin" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
            <AdminLayout />
          </CheckAuth>
          }>
          <Route path="dashboard" element={<AdminDashboard />}/>
          <Route path="products" element={<AdminProducts />}/> 
          <Route path="orders" element={<AdminOrders />}/>
          <Route path="features" element={<AdminFeatures />}/> 
        </Route>

        <Route path="/shop" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user} >
            <ShopLayout />
          </CheckAuth>
          }>
          <Route path="home" element={<ShoppingHome />}/>
          <Route path="listing" element={<ShopListing />}/>
          <Route path="checkout" element={<ShopCheckout />}/>
          <Route path="account" element={<ShopAccount />}/>
          <Route path="paypal-return" element={<PaypalReturn />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="search" element={<Search />} />
        </Route>

        <Route path="*" element={<NotFound />}>
        </Route>
        <Route path="unauth-page" element={<UnAuthPage />}>
        </Route>


      </Routes>

    </div>
  )
}

export default App
