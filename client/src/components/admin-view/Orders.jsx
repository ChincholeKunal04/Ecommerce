import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { Badge } from '../ui/badge'

import AdminOrederDetails from './OrederDetails.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from '@/store/admin/order-slice'

const AdminOrder = () => {  
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const {orderList, orderDetails} = useSelector(state => state.adminOrder)

    const dispatch = useDispatch();

    function handelFetchOrderDetails(orderId) {
        dispatch(getOrderDetailsForAdmin(orderId))
    }

    useEffect(() => {
        dispatch(getAllOrdersForAdmin())
    }, [dispatch])

    console.log(orderDetails, 'order');

    useEffect(() => {
        if(orderDetails !== null){
            setOpenDetailsDialog(true)
        }
    },[orderDetails])

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Order</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className='sr-only'>Details</span>                                
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {
                        orderList && orderList.length > 0 ?
                            orderList.map(orderItem =>
                                <TableRow>
                                    <TableCell>{orderItem?._id}</TableCell>
                                    <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                                    <TableCell>
                                        <Badge className={`py-1 px-3 ${
                                            orderItem?.orederStatus === "Confirmed"
                                                ? "bg-green-500"
                                                : orderItem?.orederStatus === "rejected"
                                                ? "bg-red-600"
                                                : "bg-black"
                                            }`}>
                                            {orderItem?.orederStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${orderItem?.totalAmount}</TableCell>
                                    <TableCell>
                                        <Dialog open={openDetailsDialog}
                                            onOpenChange={() =>{
                                            setOpenDetailsDialog(false);
                                            dispatch(resetOrderDetails());
                                        }}
                                        >
                                            <Button 
                                                onClick={() => handelFetchOrderDetails(orderItem?._id)}
                                            >
                                                View Details
                                            </Button>
                                            <AdminOrederDetails 
                                                orderDetails={orderDetails}
                                            />
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            )
                            : null
                        }
                    </TableBody>
                </Table>
            </CardContent>
        </Card>           
    )
}

export default AdminOrder;
