import React, { useState, useEffect } from 'react';
import SelectGroupTwo from './SelectGroup/SelectGroupTwo';
import TableSeats from '../Tables/TableSeats';
import { useClient } from '../../hooks/useClient';
import { FrequencyListObjectT, SelectedSeatT, TicketClientInformationT, UpdateSeatClientT } from '../../types';
import { useSelectedSeatsStore } from '../../Zustand/useSelectedSeats';
import { useSellTicket } from '../../hooks/useSellTicket';
import useSerialStation from '../../hooks/useSerialStation';
import toast from 'react-hot-toast';
import ConfirmPopup from '../../modals/confirmPopup.processes';
import PDFPopup from '../../modals/pdfPopup';
import { TicketData } from '../../types/ticket';
interface SalesFormProps {
    dataFrequency: FrequencyListObjectT;
    onUpdateBus: () => void;
};

interface PassengerData {
    name: string;
    lastName: string;
    exist?: boolean;
};

const SalesForm: React.FC<SalesFormProps> = ({ dataFrequency, onUpdateBus }: SalesFormProps) => {

    //Store seats
    const { selectedSeats, updateSeatClient } = useSelectedSeatsStore();
    //Hooks
    const { getClientByDNI } = useClient();
    const { sellTicket, sendData } = useSellTicket();
    const { getSerialStationByStationAndDNI } = useSerialStation()

    //local state
    const [destinations, setDestinations] = useState<string[]>([]);
    const [documentType, setDocumentType] = useState<string>('');
    const [documentNumber, setDocumentNumber] = useState<string>('');
    const [passengerData, setPassengerData] = useState<PassengerData>({ name: '', lastName: '' });
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [selectedDestination, setSelectedDestination] = useState<string>('');
    const [ticketSerialData, setTicketSerialData] = useState<{ serialNumber: string, actualTicket: number, id: number }>({ serialNumber: '', actualTicket: 0, id: 0 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    //total price
    const [totalPrice, setTotalPrice] = useState<number>(0);
    const [isDataReady, setIsDataReady] = useState<boolean>(false);
    const [pricesPerStop, setPricesPerStop] = useState<number[]>([]);
    // Estado de los asientos para asignacion
    const [currentSeat, setCurrentSeat] = useState<SelectedSeatT | null>(null);
    const [ticketsData, setTicketsData] = useState<TicketData[]>([]);
    const [showPdfModal, setShowPdfModal] = useState(false);


    useEffect(() => {
        const cities = dataFrequency.stop_city_names.split(',').map((city) => city.trim());
        const destination = dataFrequency.stop_station_names.split(',').map((stopOver, index) => `${stopOver.trim()} - ${cities[index]}`);
        destination.unshift('Viaje Completo');
        setDestinations(destination);

        //Datos para el ticket
        const fetchData = async () => {
            const data = await getSerialStationByStationAndDNI();
            //verificar si existe un numero de serie, caso contrario no puede vender  
            if (!data.serialNumber || data.serialNumber === "") {
                toast.error('No tiene un número de serie asignado para vender.');
                setTimeout(() => {
                    window.location.href = '/register/tickets'; // Redirigir a otra página
                }, 4000);
                return;
            };
            setTicketSerialData({
                serialNumber: data.serialNumber,
                actualTicket: data.actualTicket,
                id: data.id
            });
        };
        fetchData();
        setIsDataReady(true);
    }, [dataFrequency]);

    //UseEffect para calcular el precio por parada
    useEffect(() => {
        const calculatedPricesPerStop = () => {
            const temporalDestinations = destinations.slice(1);
            const prices = temporalDestinations.map((_, index) => {
                const pricePerStop = dataFrequency.price / (temporalDestinations.length + index + 0.5);
                return pricePerStop;
            });
            return prices;
        };
        setPricesPerStop(calculatedPricesPerStop());
    }, [isDataReady, destinations, ticketSerialData]);

    useEffect(() => {
        let accumulativePrice: number = 0;
        if (selectedSeats.length > 0 && destinations.length > 1 && selectedSeats[0].destination !== null) {
            const temporalDestinations = destinations.slice(1);
            accumulativePrice = selectedSeats.reduce((acc, seat) => {
                //Indice del destino actual
                const seatDestinationIndex = temporalDestinations.findIndex((destination) => destination === seat.destination);
                let priceToUse: number = 0;
                if (seatDestinationIndex !== -1) {
                    //Indice de pricePerStop
                    priceToUse = Number(pricesPerStop[seatDestinationIndex]);
                } else {
                    priceToUse = Number(dataFrequency.price);
                }
                return acc + (priceToUse + Number(seat.additionalCost));
            }, 0);
        } else {
            accumulativePrice = selectedSeats.reduce((acc, seat) => {
                return acc + (Number(dataFrequency.price) + Number(seat.additionalCost));
            }, 0);
        }
        setTotalPrice(Number(accumulativePrice.toFixed(2)));
    }, [selectedSeats, dataFrequency.price]);

    const isDocumentoValid = documentNumber.length === (documentType === 'Cedula' ? 10 : 9);

    // Usar efecto para desencadenar búsqueda cuando el documento es válido
    useEffect(() => {
        const fetchPassengerData = async () => {
            if (isDocumentoValid && documentNumber) {
                setIsSearching(true);
                const result = await getClientByDNI(documentNumber)
                if (result) {
                    setPassengerData({
                        name: result.client.name,
                        lastName: result.client.last_name,
                        exist: result.exist
                    });
                }
                setIsSearching(false);
            } else {
                setPassengerData({
                    name: '',
                    lastName: '',
                    exist: false
                });
            }
        };
        fetchPassengerData();
    }, [isDocumentoValid, documentType, documentNumber]);


    // Manejar cambio en "Tipo de Documento"
    const handledocumentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setDocumentType(value);
        setDocumentNumber('');
        setPassengerData({ name: '', lastName: '' });
    };

    // Manejar cambio en "Número de Documento"
    const handledocumentNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value.replace(/\D/g, ''); // Remover caracteres no numéricos
        const maxLength = documentType === 'Cedula' ? 10 : 9;
        if (value.length > maxLength) {
            value = value.slice(0, maxLength);
        }
        setDocumentNumber(value);
    };

    // Manejo de cambios en los campos de pasajero
    const handlePassengerChange = (field: keyof typeof passengerData) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassengerData((prev) => ({
            ...prev,
            [field]: e.target.value,
        }));
    };

    const handleDestinationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDestination(e.target.value);
    };

    const handleSelectSeat = (seat: SelectedSeatT) => {
        setCurrentSeat(seat);
        setDocumentType(''); // Opcional: limpiar inputs
        setDocumentNumber('');
        setPassengerData({
            name: seat.client?.name || '',
            lastName: seat.client?.last_name || '',
        });
    };

    //Agrego los datos del pasajero,  no necesito pasarle datos ya que manejare lo de passengerData
    const setClientSeat = (temporalSeat?: SelectedSeatT) => {
        const seatToUse = temporalSeat || currentSeat;
        if (seatToUse) {
            const temporalDestinations = destinations.slice(1);
            const index = temporalDestinations.findIndex((destination) => destination === selectedDestination);

            const updatePassengerData: UpdateSeatClientT = {
                seatId: seatToUse.seatId,
                client: {
                    dni: documentNumber,
                    name: passengerData.name,
                    last_name: passengerData.lastName,
                    exist: passengerData.exist,
                },
                destination: selectedDestination,
                priceDestination: pricesPerStop[index] ? Number(pricesPerStop[index].toFixed(2)) : dataFrequency.price,
            };
            updateSeatClient(updatePassengerData);
            setCurrentSeat(null);
            clearInputs();
        }
    };

    const ticketPurchaseConfirmationModal = async () => {
        if (selectedSeats.length === 1 && !currentSeat) {
            setClientSeat(selectedSeats[0]);
        };
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false); // Cierra el modal
    };

    const ticketPurchase = async () => {
        // Verifica que todos los asientos tengan datos de pasajeros
        const incompleteSeats = selectedSeats.filter(seat => !seat.client?.dni || !seat.client.name || !seat.client.last_name);
        if (incompleteSeats.length > 0) {
            toast.error('Por favor complete los datos de los pasajeros');
            return;
        };
        const localStorageData = localStorage.getItem('chaski-log');
        const cooperative_id = localStorageData ? JSON.parse(localStorageData).cooperative : null;

        const purchaseData: TicketClientInformationT = {
            frequency_id: dataFrequency.id,
            serial_id: Number(ticketSerialData.id),
            serial_number: Number(ticketSerialData.serialNumber) || 0,
            price: dataFrequency.price,
            departure_station: dataFrequency.departure_station_id,
            arrival_station: dataFrequency.arrival_station_id,
            date: new Date(),
            selectedSeats: selectedSeats,
            cooperative_id,
            payment_method: 'CAS'
        };
        const responseTicket = await sellTicket(purchaseData);
        if (responseTicket?.status !== 200) {
            toast.success('Problema con la venta del boleto');
            return;
        }
        toast.success('Compra completada');
        closeModal();
        //Obtener los codigos de los tickets
        const ticketCodes = responseTicket.message.tickets.map((ticket: any) => { return { ticketCode: ticket.ticket_code, ticketPrice: ticket.price } });
        const preparedTickets = selectedSeats.map((seat, index) => ({
            dia: purchaseData.date.toLocaleDateString(),
            horaSalida: dataFrequency.departure_time,
            horaLlegada: dataFrequency.arrival_time,
            placa: dataFrequency.license_plate,
            terminal: dataFrequency.departure_station_name,
            destino: selectedDestination,
            nombres: seat.client?.name || '',
            apellidos: seat.client?.last_name || '',
            tipoDocumento: documentType,
            numeroDocumento: seat.client?.dni || '',
            price: ticketCodes[index].ticketPrice,
            seats: [seat.seatId],
            frecuencia: dataFrequency.id,
            ticketCode: ticketCodes[index].ticketCode
        }));

        setTicketsData(preparedTickets);
        sendData(JSON.stringify(preparedTickets));
        setShowPdfModal(true);
        clearInputs();
        //Renderizar de nuevo el bus
        onUpdateBus();
    };

    const clearInputs = () => {
        setSelectedDestination('');
        setPassengerData({ name: '', lastName: '' });
        setDocumentNumber('');
    };

    return (
        <>
            <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">BOLETO: {`${ticketSerialData.serialNumber || 0}-${ticketSerialData.actualTicket}`} </h2>
            <div className="col-span-3">
                <label className="mb-3 block text-black dark:text-white text-lg font-semibold">
                    Frecuencia: {dataFrequency.id}
                </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <SelectGroupTwo label="Tipo de Documento" onChange={handledocumentTypeChange} value={documentType}>
                        <option value="Cedula">Cédula</option>
                        <option value="Pasaporte">Pasaporte</option>
                    </SelectGroupTwo>
                </div>
                <div className="relative">
                    <label className="mb-3 block text-black dark:text-white">
                        Número de Documento
                    </label>
                    <input
                        type="text"
                        placeholder="Ingrese número de documento"
                        value={documentNumber}
                        onChange={handledocumentNumberChange}
                        disabled={!documentType}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-gray-200 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {isSearching && <p className="text-sm text-gray-500">Buscando...</p>}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 my-3">
                <div>
                    <label className="mb-3 block text-black dark:text-white">
                        Nombre
                    </label>
                    <input
                        type="text"
                        placeholder="Ingrese su nombre"
                        value={passengerData.name}
                        onChange={handlePassengerChange('name')}
                        disabled={!documentType || isSearching}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-gray-200 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div>
                    <label className="mb-3 block text-black dark:text-white">
                        Apellido
                    </label>
                    <input
                        type="text"
                        placeholder="Ingrese su apellido"
                        value={passengerData.lastName}
                        onChange={handlePassengerChange('lastName')}
                        disabled={!documentType || isSearching}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-gray-200 dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <SelectGroupTwo label="Destino" value={selectedDestination} onChange={handleDestinationChange}>
                        {destinations.length > 0 ? (
                            destinations.map((destination) => (
                                <option key={destination} value={destination}>
                                    {destination}
                                </option>
                            ))
                        ) : (
                            <option value="" disabled>
                                Cargando destinos...
                            </option>
                        )}
                    </SelectGroupTwo>
                </div>
                <div>
                    <label className="mb-3 block text-black dark:text-white">
                        Total a Pagar
                    </label>
                    <input
                        type="text"
                        placeholder="Ingrese el precio"
                        value={totalPrice}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-not-allowed disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div>
                    {selectedSeats.length === 1 || selectedSeats.every(seat => seat.client) ? (
                        <>
                            <label className="mb-3 block text-black dark:text-white">
                                Procesar Pago
                            </label>
                            <button
                                type="button"
                                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                onClick={ticketPurchaseConfirmationModal}
                            >
                                Pagar
                            </button>
                        </>
                    ) : (
                        <>
                            <label className="mb-3 block text-black dark:text-white">
                                Agregar Pasajero
                            </label>
                            <button
                                type="button"
                                disabled={!documentNumber || !passengerData.name || !passengerData.lastName}
                                className={`w-full py-2 px-4 rounded-md ${documentNumber && passengerData.name && passengerData.lastName
                                    ? 'bg-green-500 hover:bg-green-600 text-white'
                                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                                    }`}
                                onClick={() => setClientSeat()}
                            >
                                Agregar
                            </button>
                        </>
                    )}
                </div>
                <div className="col-span-3">
                    <label className="mb-3 block text-black dark:text-white text-lg font-semibold">
                        Asiento: {
                            selectedSeats.length === 0
                                ? ''
                                : selectedSeats.length === 1
                                    ? selectedSeats[0].seatId
                                    : currentSeat?.seatId || 'No seleccionado'
                        }

                    </label>
                </div>
            </div>
            <div className="flex justify-between items-center my-4">
                {selectedSeats.length > 0 ? (
                    <TableSeats headerTable='Boletos' displayData={selectedSeats} onSelectSeat={handleSelectSeat} />
                ) : (
                    <div className="text-xl text-gray-500 dark:text-gray-400">
                        No hay asientos seleccionados
                    </div>
                )}
            </div>

            {/* Popup de confirmacion */}
            <ConfirmPopup
                title="Confirmar Pago"
                isOpen={isModalOpen}
                onClose={closeModal}
                onSave={ticketPurchase} // Procesa el pago al confirmar
            > <div>
                    <p className="font-semibold">Asientos seleccionados:</p>
                    <ul className="list-disc ml-5">
                        {selectedSeats.map(seat => (
                            <li key={seat.seatId}>
                                <span>Asiento: {seat.seatId}</span>,
                                <span> Cliente: {seat.client?.name || ''} {seat.client?.last_name || ''}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-4 font-semibold">Precio Total: ${totalPrice}</p>
                </div>
            </ConfirmPopup>

            {showPdfModal && (
                <PDFPopup tickets={ticketsData} />
            )}
        </>
    );
};

export default SalesForm;