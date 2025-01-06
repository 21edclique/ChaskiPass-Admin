import { cooperativeT } from './../types/index';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";
import { API_BASE_URL } from "../helpers/Constants";

export default function useCooperatives() {
    const [loading, setLoading] = useState(false);
    const [dataListCooperatives, setDataListCooperatives] = useState<cooperativeT[]>([]);

    const getCooperativeByID = async (id: string) => {
        setLoading(true);
        try{
            const response:Response = await fetch(`${API_BASE_URL}cooperatives/${id}`,{
                method:'GET',
                headers:{
                    'Content-Type':'application/json',
                },
                credentials:'include',
            });
            const data = await response.json();
            if(data.error || response.status !== 200){
                throw new Error(data.error);
            }
            return data.cooperative;
        }catch(error){
            toast.error(verifyError(error));
            return [];
        }finally{
            setLoading(false);
        }
    };

    const getCooperatives = async (): Promise<any[]> => {
        setLoading(true);
        try {
            const response: Response = await fetch(`${API_BASE_URL}cooperatives/admin`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
    
            // Verificación del estado de la respuesta
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error en la solicitud');
            }
    
            const data = await response.json();
            return data.cooperatives || []; // Retorna un array vacío si no hay cooperativas
        } catch (error) {
            toast.error(verifyError(error)); // Manejo de errores
            return []; // Retorna un array vacío en caso de error
        } finally {
            setLoading(false);
        }
    };
    
    const createCooperative = async (newCooperative: cooperativeT) => {
        setLoading(true);
        try {
            const response: Response = await fetch(`${API_BASE_URL}admins/coop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCooperative),
                credentials: 'include',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al crear la cooperativa');
            }

            const data = await response.json();
            toast.success('Cooperativa creada con éxito');
            return data.cooperative; // Devuelve la cooperativa creada
        } catch (error) {
            toast.error(verifyError(error)); // Manejo de errores
            return null; // Devuelve null si ocurre un error
        } finally {
            setLoading(false);
        }
    };






  useEffect(() => {
        const fetchData = async () => {
            const linkedCooperatives = await getCooperatives();
            setDataListCooperatives(linkedCooperatives);
 
        };
        fetchData();
    }, []);  // Solo se ejecuta una vez al montar el componente


    return{
        loading,
        dataListCooperatives,
        getCooperativeByID,
        getCooperatives,
        createCooperative
    }
}