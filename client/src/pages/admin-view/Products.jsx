import ImageUpload from "@/components/admin-view/ImageUpload";
import AdminProductTile from "@/components/admin-view/ProductTile";
import CommonForm from "@/components/common/Form";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { addProductFormElements } from "@/config";
import { useToast } from "@/hooks/use-toast";
import { addNewProduct, deleteProduct, editProduct, fetchallProducts } from "@/store/admin/prodeuct-slice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

 
const initialFormData = {
    image : null,
    title : '',
    description : '',
    category : '',
    brand : '',
    price : '',
    salePrice : '',
    totalStock : '',
}

 function AdminProducts() {

    const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
    const [formData, setFormData] = useState(initialFormData);
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const dispatch = useDispatch()
    const {productList} = useSelector((state) => state.adminProducts)
    const {toast} = useToast()

    const [currentEditedId, setCurrentEditedId] = useState(null);

    function onSubmit(event) {
        event.preventDefault();

        currentEditedId !== null ? 
        dispatch(editProduct({
            id : currentEditedId,
            formData
        })).then((data) => {
            console.log(data, 'edit')

            if (data?.payload?.success){
                dispatch(fetchallProducts());
                formData(initialFormData)
                setOpenCreateProductsDialog(false)
                currentEditedId(null)
            }
        })
        :
        dispatch(addNewProduct({
            ...formData, 
            image : uploadedImageUrl
        })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchallProducts());
                setOpenCreateProductsDialog(false);
                setImageFile(null);
                setFormData(initialFormData);
                toast({
                title: "Product add successfully",
                });
            }
        });
    }

    useEffect(() => {
        dispatch(fetchallProducts())
    }, [dispatch])

    function handelDelete(getCurrentProductId){
        dispatch(deleteProduct(getCurrentProductId))
        .then((data) => {
            if(data?.payload?.success){
                dispatch(fetchallProducts());
            }
        })
    }

    function isFormValid(){
        return Object.keys(formData).map((key) => formData[key] !== "").every((item) => item);
    }

    console.log(formData)

    return (
        <Fragment>
            <div className="mb-5 w-full flex justify-end">
                <Button onClick={() => setOpenCreateProductsDialog(true)}>
                    Add new Product
                </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                {
                    productList && productList.length > 0 ?
                    productList.map((productItem) => <AdminProductTile 
                    setCurrentEditedId={setCurrentEditedId} 
                    setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                    setFormData={setFormData}
                    product={productItem}
                    handelDelete={handelDelete}
                    />) : null
                }
            </div>
            <Sheet open={openCreateProductsDialog} 
                onOpenChange={() => {
                    setOpenCreateProductsDialog(false)
                    setCurrentEditedId(null)
                    setFormData(initialFormData)
            }}>
                <SheetContent side='right' 
                    className="overflow-auto"
                >
                    <SheetHeader>
                        <SheetTitle>
                            {
                                currentEditedId !== null ?
                                'Edit Product' : 'Add new product'
                            }
                        </SheetTitle>
                    </SheetHeader>
                    <ImageUpload 
                    imageFile={imageFile}
                    setImageFile={setImageFile}
                    uploadedImageUrl={uploadedImageUrl}
                    setUploadedImageUrl={setUploadedImageUrl}
                    setImageLoadingState={setImageLoadingState}
                    imageLoadingState={imageLoadingState}
                    isEditMode={currentEditedId !== null }
                    />
                    <div className="py-6">
                        <CommonForm
                            formControls={addProductFormElements}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={currentEditedId !== null ? 'Edit' : 'Add'}
                            onSubmit={onSubmit}
                            isBtnDisabled={!isFormValid()}
                        />
                    </div>
                </SheetContent>
            </Sheet>
        </Fragment>
    );
}

export default AdminProducts