import { useEffect, useState } from "react";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";

interface SeatType {
    id: string;
    name: string;
    special_caracter:string;
}

export default function useTypeSeats() {

    const [loading, setLoading] = useState(false);
    const [selectSeatTypes, setSelectSeatTypes] = useState<SeatType[]>([]);
    const getSeatTypes = async()=>{
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}typeSeats`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error);
            }
            const formattedData= data.json.map((seat:SeatType)=>({
                id:seat.id,
                name:seat.name,
                special_caracter:seat.special_caracter
            }));
            
            return formattedData;
        } catch (error) {
            console.log(error);
            toast.error(verifyError(error));
        }finally{
            setLoading(false);
        }
    };

    useEffect(()=>{
        getSeatTypes().then((data)=>{
            setSelectSeatTypes(data);
        })
    }, []) //registrar el cambio de estado cuando cambie seatTypes 

    return{
        selectSeatTypes,
        loading,
    }

}