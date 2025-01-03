import { useState, useEffect } from 'react';
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import useBusLayout from '../../hooks/useBusLayout';
import { SeatConfigT } from '../../types';
import toast from 'react-hot-toast';
import SelectTypesComponent from './selectTypesComponent.registration';
import SvgSeatComponent from '../../components/busElements/svgSeats.components';
import SvgBathroomComponent from '../../components/busElements/svgBathroom.components';
import SvgStairsComponent from '../../components/busElements/svgStairs.components';
import BusTemplate from '../../components/Bus';

const TypebusRegistration = () => {
    const [busConfigurationName, setBusConfigurationName] = useState(''); // Nuevo estado para el nombre del bus
    const [numFloors, setNumFloors] = useState(1); // Estado para el número de pisos
    const [floorElements, setFloorElements] = useState<{ [key: number]: SeatConfigT[] }>({ 1: [] }); // Estado para almacenar elementos por piso
    const [selectedElement, setSelectedElement] = useState<string | null>(null); // Almacena el ID del elemento seleccionado
    const [seatName, setSeatName] = useState(''); // Nombre dinámico del asiento
    const [bathCounter, setBathCounter] = useState(1); // Contador para los baños
    const [stairsCounter, setStairsCounter] = useState(1); // Contador para las escaleras
    const [selectedFloor, setSelectedFloor] = useState(1); // Piso seleccionado
    const { loading, sendBusLayout } = useBusLayout();
    //Select
    const [selectedSeatType, setSelectedSeatType] = useState<string>('');
    const handleSelectChange = (selectedvalue: string) => {
        setSelectedSeatType(selectedvalue);
    }

    // Función para verificar si el nombre del asiento ya existe en cualquier piso
    const seatNameExists = (name: string) => {
        for (const floor in floorElements) {
            if (floorElements[floor].some(el => el.type === 'seat' && el.name.toLowerCase() === name.toLowerCase())) {
                return true;
            }
        }
        return false;
    };

    const addElement = (type: string) => {
        const busContainer = document.getElementById(`bus-container-${selectedFloor}`);
        const busRect = busContainer!.getBoundingClientRect();

        if (type === 'seat' && seatName === '') return;

        // Verificar si el nombre del asiento ya existe
        if (type === 'seat' && seatNameExists(seatName)) {
            toast.error(`El nombre del asiento "${seatName}" ya existe en otro piso.`);
            return;
        }

        let newElement = {
            id: '',
            type,
            name: '',
            position: { x: 10 / busRect.width * 100, y: 10 / busRect.height * 100 },
        };

        if (type === 'seat' && seatName) {
            if (selectedSeatType === '') return toast.error('Debes seleccionar un tipo de asiento');

            newElement.id = `seat-${selectedSeatType}-${seatName.toLowerCase()}`;
            newElement.name = selectedSeatType + seatName;
            setSeatName('');
        } else if (type === 'bathroom') {
            newElement.id = `bath-${bathCounter}`;
            setBathCounter(bathCounter + 1);
        } else if (type === 'stairs') {
            newElement.id = `stairs-${stairsCounter}`;
            setStairsCounter(stairsCounter + 1);
        }

        const idExistsInAnyFloor = Object.values(floorElements).some(elements => 
            elements.some(el => el.id === newElement.id)
        );

        if (!idExistsInAnyFloor) {
            setFloorElements(prevState => ({
            ...prevState,
            [selectedFloor]: [...(prevState[selectedFloor] || []), newElement],
            }));
        } else {
            toast.error(`El ID "${newElement.id}" ya existe en otro piso. Por favor, elige un nombre diferente para el asiento.`);
        }
    };

    const removeSelectedElement = () => {
        if (selectedElement !== null) {
            const updatedElements = floorElements[selectedFloor].filter((el) => el.id !== selectedElement);
            setFloorElements({
                ...floorElements,
                [selectedFloor]: updatedElements
            });
            setSelectedElement(null);
        }
    };

    const handleFloorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newNumFloors = parseInt(e.target.value, 10);
        setNumFloors(newNumFloors);

        // Crear nuevos pisos si se selecciona más de 1
        if (newNumFloors === 2 && !floorElements[2]) {
            setFloorElements({
                ...floorElements,
                2: []
            });
        }
    };

    useEffect(() => {
        const handleDrag = (e: MouseEvent, id: string) => {
            const element = document.getElementById(id);
            const busContainer = document.getElementById(`bus-container-${selectedFloor}`);
            const busRect = busContainer!.getBoundingClientRect();
            const elementRect = element!.getBoundingClientRect();

            let shiftX = e.clientX - elementRect.left;
            let shiftY = e.clientY - elementRect.top;

            const onMouseMove = (event: MouseEvent) => {
                let newLeft = (event.clientX - busRect.left - shiftX) / busRect.width * 100;
                let newTop = (event.clientY - busRect.top - shiftY) / busRect.height * 100;

                const elementWidth = (elementRect.width / busRect.width) * 100;
                const elementHeight = (elementRect.height / busRect.height) * 100;

                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (newLeft > 100 - elementWidth) newLeft = 100 - elementWidth;
                if (newTop > 100 - elementHeight) newTop = 100 - elementHeight;

                const updatedElements = floorElements[selectedFloor].map(el =>
                    el.id === id
                        ? { ...el, position: { x: newLeft, y: newTop } }
                        : el
                );
                setFloorElements({
                    ...floorElements,
                    [selectedFloor]: updatedElements
                });
            };

            document.addEventListener('mousemove', onMouseMove);

            document.onmouseup = function () {
                document.removeEventListener('mousemove', onMouseMove);
                document.onmouseup = null;
            };
        };

        floorElements[selectedFloor]?.forEach((el) => {
            const element = document.getElementById(el.id);
            if (element) {
                element.onmousedown = (e) => {
                    setSelectedElement(el.id);
                    handleDrag(e as any, el.id);
                };
                element.ondragstart = () => false;
            }
        });
    }, [floorElements, selectedFloor]);

    // Solución al problema de las posiciones incorrectas al cambiar de piso
    useEffect(() => {
        floorElements[selectedFloor]?.forEach((el) => {
            const element = document.getElementById(el.id);
            if (element) {
                const busContainer = document.getElementById(`bus-container-${selectedFloor}`);
                const busRect = busContainer!.getBoundingClientRect();

                // Calcular la posición absoluta correctamente
                const absoluteLeft = (el.position.x / 100) * busRect.width;
                const absoluteTop = (el.position.y / 100) * busRect.height;

                element.style.left = `${absoluteLeft}px`;
                element.style.top = `${absoluteTop}px`;
            }
        });
    }, [selectedFloor, floorElements]);

    const saveSeatsConfiguration = () => {
        if (!busConfigurationName) {
            toast.error('Debes asignar un nombre al bus.');
            return;
        }
        if (floorElements[1].length === 0) {
            toast.error('El primer piso debe tener al menos un elemento.');
            return;
        }

        const cooperative = localStorage.getItem('chaski-log') || '{}';
        sendBusLayout({
            id: 0,
            name: busConfigurationName,
            cooperative_id: JSON.parse(cooperative).cooperative,
            layout: floorElements,
        });
    };

    return (
        <div className="mx-auto max-w-270">
            <Breadcrumb pageName="Registro de buses" />
            <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="controls mt-4 flex flex-col gap-4 w-[50%] max-w-lg mx-auto md:mx-0">
                    {/* Input para el nombre del bus */}
                    <input
                        type="text"
                        placeholder="Nombre del bus"
                        value={busConfigurationName}
                        onChange={(e) => setBusConfigurationName(e.target.value)}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                    {/* Selector para el número de pisos */}
                    <div className='relative z-5'>
                        <label>Número de pisos:</label>
                        <select value={numFloors} onChange={handleFloorChange}
                            className={`relative z-5 w-full appearance-none rounded-lg border border-stroke bg-white py-3 pl-5 pr-10 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${numFloors ? 'text-black dark:text-white' : 'text-gray-400'
                                }`}>
                            <option value={1}>1 Piso</option>
                            <option value={2}>2 Pisos</option>
                        </select>
                        <span className="absolute top-1/2 right-4 z-10">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <g opacity="0.8">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                        fill="#637381"
                                    ></path>
                                </g>
                            </svg>
                        </span>
                    </div>
                    <div>
                        {/* Selección de piso actual para edición */}
                        <div className='relative z-5'>
                            <label>Piso actual: </label>
                            <select
                                value={selectedFloor}
                                onChange={(e) => setSelectedFloor(parseInt(e.target.value, 10))}
                                className={`relative z-5  appearance-none rounded-lg border border-stroke bg-white py-3 pl-5 pr-10 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input ${numFloors ? 'text-black dark:text-white' : 'text-gray-400'
                                    }`}
                            >
                                {Array.from({ length: numFloors }, (_, i) => i + 1).map(floor => (
                                    <option key={floor} value={floor}>Piso {floor}</option>
                                ))}
                            </select>
                            <span className="absolute top-1/2 right-[65%] z-10 -translate-y-1/2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <g opacity="0.8">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M5.29289 8.29289C5.68342 7.90237 6.31658 7.90237 6.70711 8.29289L12 13.5858L17.2929 8.29289C17.6834 7.90237 18.3166 7.90237 18.7071 8.29289C19.0976 8.68342 19.0976 9.31658 18.7071 9.70711L12.7071 15.7071C12.3166 16.0976 11.6834 16.0976 11.2929 15.7071L5.29289 9.70711C4.90237 9.31658 4.90237 8.68342 5.29289 8.29289Z"
                                            fill="#637381"
                                        ></path>
                                    </g>
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* Input para el nombre del asiento */}
                    <label htmlFor="">Tipo de asiento</label>
                    <div className='flex gap-4'>
                        <SelectTypesComponent onSelectChange={handleSelectChange} />
                        <input
                            type="text"
                            placeholder="Numero de asiento"
                            value={seatName}
                            onChange={(e) => setSeatName(e.target.value)}
                            className="rounded-lg border-[1.5px] border-stroke bg-white py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        />

                    </div>
                    <button
                        onClick={() => addElement('seat')}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    >
                        Agregar Asiento
                    </button>
                    <button
                        onClick={() => addElement('bathroom')}
                        className="bg-purple-400 text-white px-4 py-2 rounded-lg"
                    >
                        Agregar Baño
                    </button>
                    <button
                        onClick={() => addElement('stairs')}
                        className="bg-orange-400 text-white px-4 py-2 rounded-lg"
                    >
                        Agregar Escalera
                    </button>
                    {/* Botón para eliminar el elemento seleccionado */}
                    <button
                        onClick={removeSelectedElement}
                        className={`bg-red-500 text-white px-4 py-2 rounded-lg ${selectedElement === null ? 'opacity-50' : ''}`}
                        disabled={selectedElement === null}
                    >
                        Eliminar Elemento Seleccionado
                    </button>
                    <button
                        onClick={saveSeatsConfiguration}
                        className='bg-green-500 text-white px-4 py-2 rounded-lg'
                        disabled={loading}
                    >
                        {loading ? <span className="loading loading-spinner"></span> : "Guardar"}
                    </button>
                </div>

                {/* Contenedores para los pisos */}
                {Array.from({ length: numFloors }, (_, i) => i + 1).map(floor => (
                    <div
                        key={floor}
                        id={`bus-container-${floor}`}
                        className={`relative h-[600px] w-[350px] border-4 border-gray-700 rounded-2xl bg-gradient-to-b from-gray-300 to-gray-100 shadow-lg ${selectedFloor === floor ? 'block' : 'hidden'}`}
                    >
                        <BusTemplate floorNumber={floor}>
                            {floorElements[floor]?.map((element) => {
                                const busContainer = document.getElementById(`bus-container-${floor}`);
                                const busRect = busContainer!.getBoundingClientRect();
                                const absoluteLeft = (element.position.x / 100) * busRect.width;
                                const absoluteTop = (element.position.y / 100) * busRect.height;

                                return (
                                    <div
                                        key={element.id}
                                        id={element.id}
                                        className={`absolute cursor-grab ${selectedElement === element.id}`}
                                        style={{
                                            left: `${absoluteLeft}px`,
                                            top: `${absoluteTop}px`,
                                        }}
                                    >
                                        {element.type === 'seat' && <SvgSeatComponent name={element.name} isSelected={selectedElement === element.id} status='f' />}
                                        {element.type === 'bathroom' && <SvgBathroomComponent />}
                                        {element.type === 'stairs' && <SvgStairsComponent />}
                                    </div>
                                );
                            })}
                        </BusTemplate>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TypebusRegistration;
