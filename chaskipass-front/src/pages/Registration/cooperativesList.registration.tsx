import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import useCooperatives from '../../hooks/useCooperatives'; // Hook para obtener datos
import { cooperativeT } from '../../types';

const CooperativesList = () => {
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [cooperativesPerPage] = useState(10); // Elementos por página (actualizado a 10)
  const [cooperativeList, setCooperativeList] = useState<cooperativeT[]>([]); // Lista completa de cooperativas
  const [loading, setLoading] = useState(false); // Estado de carga
  const { getCooperatives } = useCooperatives(); // Hook para operaciones de cooperativas

  // Función para obtener todas las cooperativas
  const fetchCooperatives = async () => {
    setLoading(true);
    try {
      const response = await getCooperatives(); // Llamada al backend
      setCooperativeList(response || []); // Lista completa de cooperativas
    } catch (error) {
      toast.error('Error al cargar las cooperativas');
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar datos al montar el componente
  useEffect(() => {
    fetchCooperatives();
  }, []);

  // Calcular las cooperativas a mostrar según la página actual
  const indexOfLastCooperative = currentPage * cooperativesPerPage;
  const indexOfFirstCooperative = indexOfLastCooperative - cooperativesPerPage;
  const currentCooperatives = cooperativeList.slice(
    indexOfFirstCooperative,
    indexOfLastCooperative
  );

  // Cambiar de página
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-lg dark:border-strokedark dark:bg-boxdark">
      <h2 className="text-2xl font-bold mb-6 text-center">Lista de Cooperativas</h2>

      <div className="w-full h-[600px] overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm dark:bg-gray-800 dark:border-strokedark">
          <thead className="bg-gray-100 dark:bg-gray-700">
            <tr>
              <th className="p-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Nombre</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Dirección</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Contacto</th>
              <th className="p-4 text-left text-sm font-semibold text-gray-800 dark:text-white">Email</th>
            </tr>
          </thead>
          <tbody>
            {currentCooperatives.map((cooperative) => (
              <tr key={cooperative.id} className="border-t border-gray-200 dark:border-strokedark">
                <td className="p-4 text-sm text-gray-700 dark:text-white">{cooperative.name}</td>
                <td className="p-4 text-sm text-gray-700 dark:text-white">{cooperative.address}</td>
                <td className="p-4 text-sm text-gray-700 dark:text-white">{cooperative.phone}</td>
                <td className="p-4 text-sm text-gray-700 dark:text-white">{cooperative.email}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      <div className="flex justify-center mt-6 space-x-2">
        <button
          onClick={() => paginate(1)}
          className="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-opacity-80 disabled:bg-gray-300"
          disabled={currentPage === 1}
        >
          {"<<"}
        </button>
        <button
          onClick={() => paginate(currentPage - 1)}
          className="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-opacity-80 disabled:bg-gray-300"
          disabled={currentPage === 1}
        >
          {"<"}
        </button>
        {Array.from(
          { length: Math.ceil(cooperativeList.length / cooperativesPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => paginate(index + 1)}
              className={`px-4 py-2 border rounded-md text-sm font-medium ${
                currentPage === index + 1
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {index + 1}
            </button>
          )
        )}
        <button
          onClick={() => paginate(currentPage + 1)}
          className="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-opacity-80 disabled:bg-gray-300"
          disabled={currentPage === Math.ceil(cooperativeList.length / cooperativesPerPage)}
        >
          {">"}
        </button>
        <button
          onClick={() => paginate(Math.ceil(cooperativeList.length / cooperativesPerPage))}
          className="px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-opacity-80 disabled:bg-gray-300"
          disabled={currentPage === Math.ceil(cooperativeList.length / cooperativesPerPage)}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

export default CooperativesList;
