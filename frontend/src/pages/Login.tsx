import {useState} from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../axiosConfig";
const LoginPage = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [rememberMe, setRememberMe] = useState<boolean>(false);
    const navigate = useNavigate()

    const handleLogin = async () => {
        try{
            const respone = await api.post("/token/", {
                username, password
            });
            if (rememberMe){
                localStorage.setItem("access_token", respone.data.access);
                localStorage.setItem("refresh_token", respone.data.access);
            }
            else{
                sessionStorage.setItem("access_token", respone.data.access);
                sessionStorage.setItem("refresh_token", respone.data.access);
            }
            navigate("/")
        }
        catch(error){
            alert("Login failed!");
        }
    }

    return (
        <div className="flex flex-col w-full min-h-screen justify-center items-center"> {/* The Page */} 
            <div className="p-15 rounded-xl flex flex-col items-center justify-center align-middle h-fit w-xl border-2 bg-blue-100 gap-2"> {/* The box in the middle */}

                <div className="p-2 w-full flex flex-col gap-1"> {/* Header */}
                    <h6 className="font-light text-gray-600 text-left">Hello grinder</h6>
                    <h3 className="text-2xl font-medium text-gray-600 text-left">Welcome back !</h3>
                </div> 

                <div className="flex flex-col w-full gap-2"> {/* Login information */}
                    <div className="flex flex-col p-4">
                        <div className="flex flex-col w-full h-fit gap-2">
                            <input className="text-gray-900 w-full h-10 border-1 border-gray-600 pl-2" type="text" value={username} onChange={event => setUsername(event.target.value)} placeholder="Username" />
                            <input className="text-gray-900 w-full h-10 border-1 border-gray-600 pl-2" type="text" value={password} onChange={event => setPassword(event.target.value)} placeholder="Password" />
                        </div>
                    </div>
                    <div className="flex flex-row justify-between pl-10 pr-10">
                        <div className="flex flex-row gap-4 align-middle items-center">
                            <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} />
                            <h4 className="text-gray-800" >Remember me</h4>
                        </div>
                        <div className="flex flex-row gap-4 items-center">
                            <h3 className="text-xs text-gray-800">Doesn't have an acount yet ? </h3>
                            <Link to='/signup'>Sign Up</Link>
                        </div>
                    </div>
                    <button className="mt-2 bg-blue-500 p-2 rounded-md"  onClick={handleLogin}>Login</button>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;