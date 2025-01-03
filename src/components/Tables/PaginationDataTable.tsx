import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';

interface PaginationDataTableProps {
  titles: string[];
  displayHeader: string[];
  data: Array<{ [key: string]: any }>; // Datos de la tabla como prop
  totalPages: number; // Número total de páginas para controlar la paginación
  currentPage: number; // Página actual, controlada externamente
  tableName?: string;
  onPageChange: (newPage: number) => void; // Función para cambiar la página
  loading: boolean; // Indicador de carga
  onRowClick?: (row: any) => void; // Prop para manejar el click en la fila
  dataHeaderToExpand: string[];
}

const PaginationDataTable: React.FC<PaginationDataTableProps> = ({
  titles,
  data,
  totalPages,
  currentPage,
  tableName,
  onPageChange,
  loading,
  onRowClick,
  displayHeader,
  dataHeaderToExpand,

}) => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null); // Para expandir la fila seleccionada

  const toggleExpandRow = (index: number) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">{tableName}</h4>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-700">
                {/* Solo mostrar el encabezado de expansión si hay datos a expandir */}
                {dataHeaderToExpand.length > 0 && (
                  <th className="p-2.5 text-sm font-medium text-center uppercase text-gray-700 dark:text-white"></th>
                )}
                {displayHeader.map((title, index) => (
                  <th
                    key={index}
                    className="p-2.5 text-sm font-medium text-center uppercase text-gray-700 dark:text-white"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={titles.length} className="text-center">
                    No hay datos disponibles.
                  </td>
                </tr>
              ) :
                (data.map((row, rowIndex) => (
                  <React.Fragment key={rowIndex}>
                    <tr
                      onClick={() => onRowClick?.(row)}
                      className="cursor-pointer border-b border-stroke dark:border-strokedark hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      {/* Mostrar el botón de expansión solo si hay datos a expandir */}
                      {dataHeaderToExpand.length > 0 && (
                        <td className="p-2.5 text-center">
                          <button onClick={() => toggleExpandRow(rowIndex)}>
                            <IoIosArrowDown className={`right-4 top-1/2 translate-y-1/2 fill-current ${expandedRow === rowIndex && 'rotate-180'}`} />
                          </button>
                        </td>
                      )}
                      {titles.map((title, colIndex) => (
                        <td key={colIndex} className="p-2.5 text-center text-black dark:text-white">
                          {row[title] !== undefined ? row[title] : '-'}
                        </td>
                      ))}
                    </tr>
                    {/* Renderizar la fila expandible solo si hay datos y la fila está expandida */}
                    {expandedRow === rowIndex && dataHeaderToExpand.length > 0 && (
                      <tr>
                        <td colSpan={titles.length + 1} className="p-4 bg-gray-100 dark:bg-gray-700">
                          {/* Contenido expandido de la fila */}
                          <div>{dataHeaderToExpand.map((expandedTitle, expandedColIndex) => (
                            <span key={expandedColIndex} className="block p-2">
                              {row[expandedTitle] !== undefined ? row[expandedTitle] : '-'}
                            </span>
                          ))}</div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )))

              }
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevious}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 dark:bg-gray-700"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700 dark:text-white">
          Página {currentPage} de {totalPages}
        </span>
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 dark:bg-gray-700"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default PaginationDataTable;