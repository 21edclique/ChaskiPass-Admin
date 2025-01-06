import { FaMapMarkedAlt, FaPhoneAlt, FaUserAstronaut, FaRegUser, FaIdCard, FaUserTie } from 'react-icons/fa';
import { RiTeamFill } from 'react-icons/ri';
import { MdEmail } from 'react-icons/md';
import ChaskiLogoW from '../../images/chaski-logo/chaskilogowhite.svg';
import ChaskiLogoB from '../../images/chaski-logo/chaskilogoblack.svg';
import { CreateUserT } from '../../types';
import createUser from '../../hooks/userCreation';
import { useState } from 'react';
import useCooperatives from '../../hooks/useCooperatives';

const initialStateSignUp: CreateUserT = {
  dni: '',
  name: '',
  full_name: '',
  last_name: '',
  user_name: '',
  email: '',
  phone: '',
  address: '',
  role_id: '',
  cooperative_id: '',
};

const SignUp: React.FC = () => {
  const [inputSignUp, setInputSignUp] = useState<CreateUserT>(initialStateSignUp);
  const { loading, login } = createUser();
  const { dataListCooperatives, loading: cooperativesLoading } = useCooperatives();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setInputSignUp((prev) => ({ ...prev, [id]: value }));
  };

  const handleCooperativeSelection = (name: string) => {
    const cooperative = dataListCooperatives?.find((coop) => coop.name === name);
    if (cooperative) {
      setInputSignUp((prev) => ({ ...prev, cooperative_id: cooperative.id }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(inputSignUp);
  };

  return (
    <div className="flex h-screen items-center justify-center dark:bg-boxdark">
      <div className="flex flex-wrap items-center">
        <div className="hidden w-full xl:block xl:w-1/2">
          <div className="py-10 px-12 text-center">
            <img className="dark:hidden" src={ChaskiLogoB} alt="Logo" />
            <img className="hidden dark:block" src={ChaskiLogoW} alt="Logo" />
          </div>
        </div>
        <div className="w-full border-stroke dark:border-none xl:w-1/2 xl:border-l-2">
          <div className="w-full p-2 sm:p-10.5 xl:p-17.5">
            <span className="mb-1.5 block font-medium">Registro</span>
            <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
              ChaskiPass - Registro de Usuarios
            </h2>
            <form onSubmit={handleSubmit}>
              {/* CI y Nombre */}
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <InputField id="dni" label="Cédula de Identidad" icon={<FaIdCard />} placeholder="Ingrese su CI" value={inputSignUp.dni} onChange={handleChange} />
                <InputField id="name" label="Nombre" icon={<FaRegUser />} placeholder="Ingrese su nombre" value={inputSignUp.name} onChange={handleChange} />
              </div>

              {/* Apellido y Usuario */}
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <InputField id="last_name" label="Apellido" icon={<FaUserTie />} placeholder="Ingrese su apellido" value={inputSignUp.last_name} onChange={handleChange} />
                <InputField id="user_name" label="Nombre de usuario" icon={<FaUserAstronaut />} placeholder="Usuario" value={inputSignUp.user_name} onChange={handleChange} />
              </div>

              {/* Cooperativa */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Selecciona una Cooperativa</label>
                <input
                  list="cooperatives"
                  id="cooperative_id"
                  placeholder="Selecciona una cooperativa"
                  value={
                    inputSignUp.cooperative_id
                      ? dataListCooperatives?.find((coop) => coop.id === inputSignUp.cooperative_id)?.name || ''
                      : ''
                  }
                  onChange={(e) => handleCooperativeSelection(e.target.value)}
                  className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
                />
                <datalist id="cooperatives">
                  {cooperativesLoading ? (
                    <option value="Cargando..." disabled />
                  ) : (
                    dataListCooperatives?.map((coop) => <option key={coop.id} value={coop.name} />)
                  )}
                </datalist>
              </div>

              {/* Email y Teléfono */}
              <InputField id="email" label="Email" icon={<MdEmail />} placeholder="Ingresa tu email" value={inputSignUp.email} onChange={handleChange} />
              <InputField id="phone" label="Teléfono" icon={<FaPhoneAlt />} placeholder="Ingresa tu número de teléfono" value={inputSignUp.phone} onChange={handleChange} />

              {/* Dirección */}
              <InputField id="address" label="Dirección" icon={<FaMapMarkedAlt />} placeholder="Ingresa tu dirección" value={inputSignUp.address} onChange={handleChange} />

              {/* Rol */}
              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-black dark:text-white">Rol de Usuario</label>
                <select
                  id="role_id"
                  value={inputSignUp.role_id}
                  onChange={handleChange}
                  className="w-full rounded border border-stroke bg-gray py-3 pl-4.5 pr-11.5 text-black focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
                >
                  <option value="" disabled>
                    Selecciona un rol
                  </option>
                  <option value="admin">Administrador</option>
                  <option value="drive">Conductor</option>
                  <option value="clerk">Oficinista</option>
                </select>
                <span className="absolute right-4.5 top-4">
                  <RiTeamFill className="w-[22px] h-[22px]" />
                </span>
              </div>

              {/* Botón */}
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
              >
                {loading ? <span className="loading loading-spinner"></span> : 'Registrar'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputField = ({
  id,
  label,
  icon,
  placeholder,
  value,
  onChange,
}: {
  id: string;
  label: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="mb-4">
    <label className="mb-2.5 block font-medium text-black dark:text-white">{label}</label>
    <div className="relative">
      <input
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary dark:border-form-strokedark dark:bg-form-input dark:text-white"
      />
      <span className="absolute right-4 top-4">{icon}</span>
    </div>
  </div>
);

export default SignUp;
