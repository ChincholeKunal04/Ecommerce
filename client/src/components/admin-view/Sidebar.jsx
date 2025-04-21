import { Fragment } from "react";
import { ChartNoAxesCombined } from 'lucide-react'
import { useNavigate } from "react-router-dom"; 
import { LayoutDashboard, ShoppingBasket, Box } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSideBarMenuItems = [
    {
        id : 'dashbaord',
        label : 'dashboard',
        path : '/admin/dashboard',
        icons : <LayoutDashboard />,
    },
    {
        id : 'products',
        label : 'products',
        path : '/admin/products',
        icons : <ShoppingBasket />,
    },
    {
        id : 'orders',
        label : 'orders',
        path : '/admin/orders',
        icons : <Box />,
    },
  ]

function MenuItems({setOpen}) {
    const navigate = useNavigate()

    return <nav className="mt-8 flex-col flex gap-2">
        {
            adminSideBarMenuItems.map((item) => 
                <div key={item.id} 
                    onClick={() => {
                        navigate(item.path)
                        setOpen ?  setOpen(false) : null
                    }} 
                    className="flex items-center cursor-pointer gap-2 font-bold rounded-md py-2 px-3 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                    {item.icons}
                    <span >{item.label}</span>
                </div>)
        }
    </nav>
}

function AdminSidebar({open, setOpen}) {

    const navigate = useNavigate()

    return (
        <Fragment>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className='w-64'>
                    <div className="flex flex-col h-full">
                        <SheetHeader className="border-b">
                            <SheetTitle className="flex gap-2 mb-2">
                                <ChartNoAxesCombined size={30} />
                                <span>Admin Panel</span>
                            </SheetTitle>
                        </SheetHeader>
                        <MenuItems setOpen={setOpen}/>
                    </div>
                </SheetContent>
            </Sheet>
            <aside className="hidden w-64 flex-col bg-background p-6 border-r lg:flex">
                <div onClick={() => navigate('/admin/dashboard')}
                className="flex cursor-pointer items-center gap-2">
                    <ChartNoAxesCombined size={30} />
                    <h1 className="text-2xl font-extrabold">Admin Panel</h1>
                </div>
                <MenuItems />
            </aside>
        </Fragment>
    );
}

export default AdminSidebar