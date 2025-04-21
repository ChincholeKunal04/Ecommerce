import React from 'react'
import { Card, CardContent, CardFooter } from '../ui/card'
import { Label } from '../ui/label'
import { Button } from '../ui/button'

const AddressCard = ({addressInfo, handleDeleteAddress, handleEditAddress, setCurrentSelectedAddress, selectedId}) => {
    console.log(selectedId)
  return (
    <Card 
    onClick={setCurrentSelectedAddress ? () => setCurrentSelectedAddress(addressInfo) : null}
    className={`cursor-pointer border-red-700 ${
        selectedId?._id === addressInfo?._id
          ? "border-red-900 border-[4px]"
          : "border-black"
    }`}>
        <CardContent className={`${selectedId === addressInfo?._id ? 'border-black' : ""} grid gap-4 p-4`}>
            <Label >Address : {addressInfo?.address}</Label>
            <Label >City : {addressInfo?.city}</Label>
            <Label >Phone : {addressInfo?.phone}</Label>
            <Label >Pincode : {addressInfo?.pincode}</Label>
            <Label >Nores : {addressInfo?.notes}</Label>
        </CardContent>
        <CardFooter className='p-3 flex justify-between'>
            <Button onClick = {() => handleEditAddress(addressInfo)}>
                Edit
            </Button>
            <Button onClick = {() => handleDeleteAddress(addressInfo)}>
                Delete
            </Button>
        </CardFooter>
    </Card>
  )
}

export default AddressCard
