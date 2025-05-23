import CommonForm from "@/components/common/Form";
import { useState } from "react";
import { loginFormControls } from "@/config";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginUser } from "@/store/auth-slice";
import { useToast } from "@/hooks/use-toast";

const initialState = {
    email : '',
    password : '',
}


function AuthLogin() {

    const [formData, setFormData] = useState(initialState);

    const dispatch = useDispatch();
    const { toast } = useToast()

    function onSubmit(event) {
        event.preventDefault();

        dispatch(loginUser(formData)).then((data) => {
            if (data?.payload?.success) {
              toast({
                title: data?.payload?.message,
              });
            } else {
              toast({
                title: data?.payload?.message,
                variant: "destructive",
              });
            }
        });
    }

    return (
        <div className="mx-auto w-full max-w-md space-y-6">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Login to your account</h1>
                <p className="mt-2">Don't have an account 
                    <Link className="font-medium text-primary hover:underline ml-2" to='/auth/register'>Register</Link>
                </p>
            </div>
            <CommonForm 
                formControls={loginFormControls}
                buttonText={'Login'}
                formData={formData}
                setFormData={setFormData}
                onSubmit={onSubmit}
            />
        </div>
    );
}

export default AuthLogin;