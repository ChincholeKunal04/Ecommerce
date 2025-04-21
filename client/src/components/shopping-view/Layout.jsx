import { Outlet } from "react-router-dom";
import ShopHeader from "./Header";



function ShopLayout() {
    return (
        <div className="flex flex-col bg-white overflow-hidden">
            {/* shop header */}
            <ShopHeader />
            <main className="flex flex-col w-full">
                <Outlet />
            </main>
        </div>
    );
}

export default ShopLayout