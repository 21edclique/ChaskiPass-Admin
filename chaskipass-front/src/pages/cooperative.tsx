import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CoverOne from '../images/cover/cover-01.png';
import userSix from '../images/user/user-06.png';
import { IoCameraOutline } from "react-icons/io5";
import { cooperativeT } from '../types';
import { useEffect, useState } from 'react';
import useCooperatives from '../hooks/useCooperatives';

const initialData: cooperativeT ={
  id: "",
  name: '',
  address: '',
  phone: '',
  email: '',
  logo: '',
};

const Profile = () => {

  const [cooperativeInputs, setCooperativeInputs] = useState<cooperativeT>(initialData);
  const {getCooperativeByID} = useCooperatives();

  useEffect(()=> {
    const fetchCooperative= async()=>{
      const storageData = localStorage.getItem('chaski-log');
      let cooperativeID:string
      if(storageData){
        const data = JSON.parse(storageData);
        cooperativeID = data.cooperative;
      }

      const cooperative = await getCooperativeByID(cooperativeID!.toString());
      setCooperativeInputs(cooperative);
    };
    fetchCooperative();
  },[]);


  return (
    <>
      <Breadcrumb pageName="Profile" />

      <div className="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="relative z-20 h-35 md:h-65">
          <img
            src={CoverOne}
            alt="profile cover"
            className="h-full w-full rounded-tl-sm rounded-tr-sm object-cover object-center"
          />
        </div>
        <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
          <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-44 sm:p-3">
            <div className="relative drop-shadow-2">
              <img src={userSix} alt="profile" />
              <label
                htmlFor="profile"
                className="absolute bottom-0 right-0 flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-full bg-primary text-white hover:bg-opacity-90 sm:bottom-2 sm:right-2"
              >
                <IoCameraOutline />
                <input
                  type="file"
                  name="profile"
                  id="profile"
                  className="sr-only"
                />
              </label>
            </div>
          </div>
          <div className="mt-4">
            <h3 className="mb-1.5 text-2xl font-semibold text-black dark:text-white">
              Nombre Cooperativa de buses
            </h3>
            <p className="font-medium">Cooperativa De Buses</p>
            <div className="w-full">
              <form action="">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row ">
                  <div className="w-full sm:w-[50%]">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white text-left"
                      htmlFor="cooperativeName"
                    >
                      Cooperativa
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-1 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="cooperativeName"
                        id="cooperativeName"
                        value={cooperativeInputs.name}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-[85%]">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white text-left"
                      htmlFor="address"
                    >
                      Direccion
                    </label>
                    <div className="relative">
                      
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-1 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="address"
                        id="address"
                        value={cooperativeInputs.address}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-[50%]">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white text-left"
                      htmlFor="phone"
                    >
                      telefono
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-1 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="phone"
                        id="phone"
                        value={cooperativeInputs.phone}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-[50%]">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white text-left"
                      htmlFor="mail"
                    >
                      email
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-1 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="mail"
                        id="mail"
                        value={cooperativeInputs.email}
                      />
                    </div>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
