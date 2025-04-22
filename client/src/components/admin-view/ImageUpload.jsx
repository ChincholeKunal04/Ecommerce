import { useEffect, useRef } from "react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";



const ImageUpload = ({
    isEditMode,
    imageFile, 
    setImageFile, 
    uploadedImageUrl, 
    setUploadedImageUrl, 
    setImageLoadingState, 
    imageLoadingState,
    isCustomStyling = false
}) => {

    const inputRef = useRef(null);

    function handelImageFileChange(event) {
        console.log(event.target.files)
        const selectedFile = event.target.files?.[0]

        if(selectedFile){
            setImageFile(selectedFile)
        }
    }

    function handelRemoveImage() {
        setImageFile(null)
        if(inputRef.current){
            inputRef.current.value = ""
        }
    }

    
    function handelDragOver(event) {
        event.preventDefault()
    }
    
    function handelDrop(event) {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files?.[0];
        if(droppedFile){
            setImageFile(droppedFile);
        }
    }

    const backendURL = import.meta.env.VITE_BACKEND_URI

    async function uploadImageToCloudinary() {
        setImageLoadingState(true)
        const data = new FormData();
        data.append('my_file', imageFile)
        const response = await axios.post(`${backendURL}/api/admin/products/upload-image`, data)

        console.log(response.data);
        if(response.data?.success) {
            setUploadedImageUrl(response.data.result.url);
            setImageLoadingState(false);
        }
    }
    
    // console.log(imageFile);

    useEffect(() => {
        if(imageFile !== null){
            uploadImageToCloudinary()
        }
    }, [imageFile])

  return (
    <div className={`w-full mt-4 ${isCustomStyling ? '' : 'max-w-md mx-auto'}`}>
        <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>
        <div 
            onDragOver={handelDragOver}
            onDrop={handelDrop}
            className={`${
                isEditMode ? "opacity-60" : ""
              } border-2 border-dashed rounded-lg p-4`}
            > 
            <Input 
            id="image-upload" 
            type="file" 
            className="hidden" 
            ref={inputRef} 
            onChange={handelImageFileChange} 
            disabled={isEditMode}
            />
            {
                !imageFile ? 
                (<Label htmlFor="image-upload" className={`${
                    isEditMode ? "cursor-not-allowed" : ""
                  } flex flex-col items-center justify-center h-32 cursor-pointer`}>
                    <UploadCloudIcon className="w-10 h-10 mb-2 text-muted-foreground"/>
                    <span>Drag and drop or click to upload image</span>
                </Label>) : (
                    imageLoadingState ? 
                    <Skeleton className="h-10 bg-gray-100" /> :
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <FileIcon className="h-8 w-8 mr-2 text-primary"/>
                    </div>
                    <p className="text-sm font-medium">{imageFile.name}</p> 
                    <Button varient="ghost" size="icon" className="text-muted-foreground hover:text-foreground" 
                        onClick={handelRemoveImage}
                    >
                        <XIcon className="w-4 h-4"/>
                        <span className="sr-only">Remove file</span>
                    </Button>
                </div>
                )  
            }
        </div>
    </div>
  )
}

export default ImageUpload
