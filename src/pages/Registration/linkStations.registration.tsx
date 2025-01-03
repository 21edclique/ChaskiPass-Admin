import { useState, useEffect } from 'react';
import useBusStations from '../../hooks/useBusStations';
import useLinkCooperativeStation from '../../hooks/useLinkCooperativeStation';
import toast from 'react-hot-toast';
import PaginationDataTable from '../../components/Tables/PaginationDataTable';
import { LinkCooperativesT } from '../../types';
import { HiX } from 'react-icons/hi';
import DataList from '../../components/DataList/datalist.components';

const LinkStations = () => {
  const [selectedStations, setSelectedStations] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { allBusStations, loading: stationsLoading } = useBusStations();
  const {
    linkStation,
    getLinkedStations,
    loading: saving,
  } = useLinkCooperativeStation();
  const [linkedStations, setLinkedStations] = useState<LinkCooperativesT[]>([]);

  const fetchLinkedStations = async (page: number) => {
    try {
      const result = await getLinkedStations(page);
      setTotalPages(result.totalPages);
      setLinkedStations(result.list);
    } catch (error) {
      toast.error('Error al obtener las estaciones vinculadas.');
    }
  };

  useEffect(() => {
    fetchLinkedStations(currentPage);
  }, [currentPage]);

  const handleStationSelection = (stationId: string) => {
    const selectedStation = allBusStations.find((station) => station.id === stationId);
    if (selectedStation) {
      setSelectedStations((prev) =>
        prev.includes(selectedStation)
          ? prev.filter((s) => s.id !== stationId)
          : [...prev, selectedStation]
      );
    }
  };

  const handleRemoveStation = (stationId: string) => {
    setSelectedStations((prev) => prev.filter((s) => s.id !== stationId));
  };

  const handleSave = async () => {
    try {
      if (selectedStations.length === 0) {
        toast.error('Por favor, selecciona al menos una estación.');
        return;
      }

      for (const station of selectedStations) {
        const result = await linkStation(station.id);
        if (result && result.status === 'success') {
          // Éxito por estación
        } else {
          // Error por estación
        }
      }

      setSelectedStations([]);
      const result = await getLinkedStations(currentPage);
      if (result && result.length) {
        setTotalPages(Math.ceil(result.length / 5));
      }
    } catch (error) {
      toast.error('Error al guardar las estaciones.');
    }
  };

  const handleCancel = () => {
    setSelectedStations([]);
  };

  return (
    <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark"> {/* Fondo oscuro para dark mode */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mt-12 max-w-full px-10 w-full">
        {/* Panel izquierdo */}
        <div className="col-span-1 w-full">
          <div className="rounded-xl border border-stroke bg-white dark:bg-gray-800 shadow-xl dark:border-strokedark w-full">
            <div className="border-b border-stroke py-6 px-9 dark:border-strokedark">
              <h3 className="font-semibold text-2xl text-black dark:text-white">
                Enlazar rutas
              </h3>
            </div>
            <div className="p-10">
              <div className="mb-6">
                {stationsLoading ? (
                  <p className="text-gray-500 text-lg">Cargando estaciones...</p>
                ) : (
                  <DataList
                    id="station-selector"
                    label="Selecciona una estación:"
                    options={allBusStations}
                    placeholder="Escribe para buscar..."
                    onSelect={handleStationSelection}
                    value={selectedStations.map((station) => station.name).join(', ')}
                    opKey="id"
                    opValue="name"
                    optionP="name"
                    className="dark:bg-gray-700 dark:text-white" // Dark mode class here
                  />
                )}
              </div>
              {selectedStations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium text-lg text-black dark:text-white mb-3">
                    Estaciones seleccionadas
                  </h4>
                  <div className="space-y-2">
                    {selectedStations.map((station) => (
                      <div
                        key={station.id}
                        className="flex justify-between items-center p-3 rounded-md border border-gray-300 bg-gray-50 shadow-sm dark:bg-gray-700 dark:border-strokedark"
                      >
                        <span className="text-base text-gray-800 dark:text-white">
                          {station.name}
                        </span>
                        <button
                          onClick={() => handleRemoveStation(station.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <HiX size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-8 mt-10">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full rounded-md border border-primary bg-primary py-3 text-lg text-white transition hover:bg-opacity-90"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full rounded-md border border-gray-400 bg-gray-300 py-3 text-lg text-black transition hover:bg-opacity-90 dark:bg-gray-700 dark:text-white"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Panel derecho con DataTable más grande */}
        <div className="col-span-1 w-full">
          <div className="rounded-xl border border-stroke bg-white dark:bg-gray-800 shadow-xl dark:border-strokedark w-full">
            <div className="border-b border-stroke py-6 px-9 dark:border-strokedark">
              <h3 className="font-semibold text-2xl text-black dark:text-white">
                Estaciones vinculadas
              </h3>
            </div>
            <div className="p-10">
              {/* Aquí agregamos un contenedor con altura y tamaño de la tabla ajustado */}
              <div className="w-full h-[600px] overflow-x-auto">
                <PaginationDataTable
                  titles={['name']}
                  displayHeader={['Estación']}
                  data={linkedStations}
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={(newPage) => {
                    setCurrentPage(newPage);
                    fetchLinkedStations(newPage);
                  }}
                  loading={false}
                  onRowClick={() => {}}
                  dataHeaderToExpand={[]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkStations;
