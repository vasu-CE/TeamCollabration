import React from "react";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input"
 

export default function Login() {
    return (
        <div>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        TAMPS Login
                    </h3>
                    <form className="space-y-4">
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-600 text-sm" htmlFor="userid">User ID</label>
                            <Input type="text" placeholder="enter your id" />
                        </div>
                        <div className="flex flex-col space-y-2">
                            <label className="text-gray-600 text-sm" htmlFor="password">Password</label>
                            <Input type="password" placeholder="password" />

                        </div>
                        <div className="text-sm text-blue-600 hover:underline cursor-pointer">  Forgot Password?
                                </div>
                        <Button>Login</Button>
                        
                    </form>

                </div>
            </div>



        </div>


    );
}