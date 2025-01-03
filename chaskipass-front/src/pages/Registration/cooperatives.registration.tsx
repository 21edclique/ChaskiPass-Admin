import { useState } from 'react'; 
import { FaMapMarkedAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'; 
import { MdDescription } from 'react-icons/md'; 
import { CreateCooperativeT } from '../../types'; 
import usecreateCooperative from '../../hooks/useCooperatives'; 
import toast from 'react-hot-toast';

const initialStateCooperative: CreateCooperativeT = {
  id: '',
  name: '',
  address: '',
  phone: '',
  email: '',
  description: ''
};

// Simulación de una lista de cooperativas ya existentes (esto normalmente lo harías con una API)
const existingCooperatives = ['123', '456', '789'];

const Cooperatives: React.FC = () => {
  const [inputCooperative, setInputCooperative] = useState<CreateCooperativeT>(initialStateCooperative);
  const { loading, createCooperative } = usecreateCooperative();  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputCooperative({
      ...inputCooperative,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones: Campos vacíos
    if (
    //   !inputCooperative.id ||
      !inputCooperative.name ||
      !inputCooperative.address ||
      !inputCooperative.phone ||
      !inputCooperative.email ||
      !inputCooperative.description
    ) {
      toast.error('Todos los campos son obligatorios');
      return;
    }

    // Validación: ID duplicado
    if (existingCooperatives.includes(inputCooperative.id)) {
      toast.error('El ID de la cooperativa ya existe');
      return;
    }

    // Si las validaciones son pasadas, crear la cooperativa
    createCooperative(inputCooperative)
      .then(() => {
        // toast.success('Cooperativa registrada con éxito');
      })
      .catch(() => {
        toast.error('Error al registrar la cooperativa');
      });
  };

  return (
    <div className="flex h-screen items-center justify-center dark:bg-boxdark">
      <div className="w-full max-w-3xl p-4 sm:p-10.5 xl:p-17.5">
        <span className="mb-1.5 block font-medium">Registro de Cooperativa</span>
        <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
          ChaskiPass - Registro de Cooperativas
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="mb-4 w-full sm:w-1/2">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                ID de Cooperativa
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ingrese el ID de la cooperativa"
                  id="id"
                  value={inputCooperative.id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>

            <div className="mb-4 w-full sm:w-1/2">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Nombre de Cooperativa
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ingrese el nombre de la cooperativa"
                  id="name"
                  value={inputCooperative.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <div className="mb-4 w-full sm:w-1/2">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Dirección
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ingrese la dirección"
                  id="address"
                  value={inputCooperative.address}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <span className="absolute right-4 top-4">
                  <FaMapMarkedAlt className="w-[22px] h-[22px]" />
                </span>
              </div>
            </div>

            <div className="mb-4 w-full sm:w-1/2">
              <label className="mb-2.5 block font-medium text-black dark:text-white">
                Teléfono
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Ingrese el número de teléfono"
                  id="phone"
                  value={inputCooperative.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
                <span className="absolute right-4 top-4">
                  <FaPhoneAlt className="w-[22px] h-[22px]" />
                </span>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="Ingrese el correo electrónico"
                id="email"
                value={inputCooperative.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <span className="absolute right-4 top-4">
                <FaEnvelope className="w-[22px] h-[22px]" />
              </span>
            </div>
          </div>

          <div className="mb-4">
            <label className="mb-2.5 block font-medium text-black dark:text-white">
              Descripción
            </label>
            <div className="relative">
              <textarea
                placeholder="Ingrese una descripción de la cooperativa"
                id="description"
                value={inputCooperative.description}
                onChange={handleChange}
                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              />
              <span className="absolute right-4 top-4">
                <MdDescription className="w-[22px] h-[22px]" />
              </span>
            </div>
          </div>

          <div className="mb-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
            >
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                'Registrar Cooperativa'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Cooperatives;