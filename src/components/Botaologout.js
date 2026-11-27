import { useRouter } from "expo-router";
import { Button, } from 'react-native';
import { logout } from "../services/auth";
 
export default function Botaologout(){
     const router =useRouter()

async function handleLogout(){
    
        await logout(); 
        router.replace("/login")
}
 return(<Button
                title ="Logout"
                onPress={handleLogout}
                />)
}