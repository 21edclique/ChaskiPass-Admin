import { useEffect, useState } from "react";
import { API_BASE_URL } from "../helpers/Constants";
import toast from "react-hot-toast";
import { verifyError } from "../helpers/VerifyErrors";
import { UserT } from "../types";

export default function useUsers() {
  const [loading, setLoading] = useState(false);
  const [dataListUsers, setDataListUsers] = useState<UserT[]>([]);

  const getDrivers = async () => {
    setLoading(true);
    try {
      const res: Response = await fetch(`${API_BASE_URL}users/drivers`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }
      return data;
    } catch (error) {
      console.error(error);
      toast.error(verifyError(error));
    } finally {
      setLoading(false);
    }
  };

  const getUsersByDni = async (dni: string) => {
    setLoading(true);
    try {
      const res: Response = await fetch(`${API_BASE_URL}users/${dni}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
  
      const result = await res.json(); // Extraer la respuesta completa
      console.log("API response:", result); // Depuración de la respuesta
  
      if (!res.ok) {
        console.error("Error fetching user by DNI:", result.json.error);
        if (res.status === 404) {
          return null; // Usuario no encontrado
        }
        throw new Error(result.json.error || "Failed to fetch user data.");
      }
  
      return result.json; // Devolver los datos reales del usuario
    } catch (error) {
      console.error("Error in getUsersByDni:", error);
      toast.error("Failed to fetch user data.");
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  


  const updateUsers = async (dni: string, updatedData: Partial<UserT>) => {
    setLoading(true);
    try {
      const body = {
        dni,
        ...updatedData, // Incluye los datos proporcionados
      };
  
      console.log("Sending data to update user:", body); // Para depuración
  
      const res: Response = await fetch(`${API_BASE_URL}users/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
  
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update user.");
      }
  
      // Muestra un mensaje de éxito
      toast.success("User updated successfully");
      return data; // Devuelve la respuesta de la API
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(verifyError(error));
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    getDrivers().then((data) => {
      if (data) {
        setDataListUsers(data); // Set the list to the state
      }
    });
  }, []);

  return {
    loading,
    dataListUsers,
    getDrivers,
    updateUsers,
    getUsersByDni
  };
}
