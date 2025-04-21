import { useEffect, useState } from "react";
import ImageUpload from "@/components/admin-view/ImageUpload";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { addFeatureImages, getFeatureImages } from "@/store/common";

function AdminDashboard() {
    const [imageFile, setImageFile] = useState(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const dispatch = useDispatch()

    const {featureImageList} = useSelector((state) => state.commonFeature)

    function handelUploadFeatureImage(){
        dispatch(addFeatureImages(uploadedImageUrl))
        .then((data) => {
            if(data?.payload?.success) {
                dispatch(getFeatureImages())
                setImageFile(null)
                setUploadedImageUrl("")
            }
            console.log(data)
        })
    }

    useEffect(() => {
        dispatch(getFeatureImages())
    },[dispatch])
    console.log(featureImageList, 'fer')

    return (
        <div>
            {/* <h1>Upload Feature Images</h1> */}
            <ImageUpload 
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isCustomStyling={true}
                // isEditMode={currentEditedId !== null }
            />
            <Button
            onClick={handelUploadFeatureImage}
            className="mt-5 w-full">
                Upload
            </Button>
            <div className="flex flex-col gap-4 mt-5"> 
                {
                    featureImageList && featureImageList.length > 0 ?
                    featureImageList.map(featureImageItem => 
                        <div className="relative">
                            <img
                            src={featureImageItem.image}
                            className="w-full h-[300px] object-cover rounded-t-lg"
                            />
                        </div>
                    ) : null
                }
            </div>
        </div>
    );
}

export default AdminDashboard