import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const tokenLocal = localStorage.getItem("access_token");
    const tokenSession = sessionStorage.getItem("access_token");
    const token = tokenLocal || tokenSession
    if (!token){
        return <Navigate to="/login" replace/>
    } 
    return <Outlet/>
};

export default ProtectedRoute;