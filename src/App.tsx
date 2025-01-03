import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import ECommerce from './pages/Dashboard/ECommerce';
import Profile from './pages/cooperative';
import Settings from './pages/Settings';
import DefaultLayout from './layout/DefaultLayout';
import BusRegistration from './pages/Registration/bus.registration';
import RoutesRegistration from './pages/Processes/routes.processes';
import TypebusRegistration from './pages/Registration/typebus.registration';
import TicketsalesRegistration from './pages/Processes/ticketsales.processes';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext';
import FrequencyRegistration from './pages/Processes/frequency.processes';

import TicketSeriesRegistration from './pages/Registration/tickets.registration';
import BusStationRegistration from './pages/Registration/busStation.registration';
import FrequencyList from './pages/Processes/frequencyList.processes';
import ProtectedRoute from './utils/protectedRoute.utils';
import LinkStationsRegistration from './pages/Registration/linkStations.registration';
import { authInterceptor } from './hooks/useInterceptor';
import Cooperatives from './pages/Registration/cooperatives.registration';
import CooperativesList from './pages/Registration/cooperativesList.registration';


function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();
  //user authenticated?
  const { authUser } = useAuthContext();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  // Condición para determinar si aplicar o no DefaultLayout
  const isAuthRoute = pathname === '/auth/signin';

  return loading ? (
    <Loader />
  ) : (
    <>
      {isAuthRoute ? (
        <>
          <Routes>
        
            <Route
              path="/auth/signin"
              element={
                
                authUser ? <Navigate to='/' /> :
                
                  <>
                    <PageTitle title="SignIn | ChaskiPass" />
                    <SignIn />
                  </>
              }
            />
          </Routes>
          <Toaster />
        </>
      ) : (
        <DefaultLayout>
          <Routes>
            {/* <Route
              path='/'
              element={
                <ProtectedRoute requiredRole={['superAdmin', 'clerk']}>
                  <>
                    <PageTitle title="eCommerce Dashboard | ChaskiPass" />
                    <ECommerce />
                  </>
                </ProtectedRoute>
              }
            /> */}
           {/* <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <>
                    <PageTitle title="Cooperativas | ChaskiPass" />
                    <Profile />
                  </>
                </ProtectedRoute>
              }
            />  */}
            {/* <Route
              path="/settings"
              element={
                <ProtectedRoute requiredRole={['superAdmin']}>
                  <>
                    <PageTitle title="Settings | ChaskiPass" />
                    <Settings />
                  </>
                </ProtectedRoute>
              }
            /> */}
            <Route
              path="/auth/signup"
              element={
                <ProtectedRoute requiredRole={['superAdmin']}>
                  <>
                    <PageTitle title="Signin | ChaskiPass" />
                    <SignUp />
                  </>
                </ProtectedRoute>
              }
            />
            {/* Added by me  */}
            <Route
              path="/register/cooperatives"
              element={

                <ProtectedRoute requiredRole={['superAdmin']}>
                  <>
                    <PageTitle title="Cooperatives | ChaskiPass" />
                    <Cooperatives/>
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/register/cooperativesList"
              element={
                <ProtectedRoute requiredRole={['superAdmin']}>
                  <>
                    <PageTitle title="Routes | ChaskiPass" />
                    <CooperativesList />
                  </>
                </ProtectedRoute>
              }
            />
            {/* <Route
              path="/register/busStations"
              element={
                <ProtectedRoute requiredRole={['superAdmin', 'clerk']}>
                  <>
                    <PageTitle title="BusStations| ChaskiPass" />
                    <BusStationRegistration />
                  </>
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/register/typebus"
              element={
                <ProtectedRoute requiredRole={['superAdmin']}>
                  <>
                    <PageTitle title="Typebus| ChaskiPass" />
                    <TypebusRegistration />
                  </>
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/register/tickets"
              element={
                <ProtectedRoute requiredRole={['superAdmin', 'clerk']}>
                  <>
                    <PageTitle title="Tickets| ChaskiPass" />
                    <TicketSeriesRegistration />
                  </>
                </ProtectedRoute>
              }
            /> */}

            {/* <Route
              path="/processes/ticketsales"
              element={
                <ProtectedRoute requiredRole={['superAdmin', 'clerk']}>
                  <>
                    <PageTitle title="Ticketsales| ChaskiPass" />
                    <TicketsalesRegistration />
                  </>
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/processes/frequency"
              element={
                <ProtectedRoute requiredRole={['superAdmin', 'clerk']}>
                  <>
                    <PageTitle title="Frecuencias Creación | ChaskiPass" />
                    <FrequencyRegistration />
                  </>
                </ProtectedRoute>
              }
            /> */}
            {/* <Route
              path="/processes/frequency-list"
              element={
                <ProtectedRoute requiredRole={['superAdmin', 'clerk']}>
                  <>
                    <PageTitle title="Frecuencias de selección | ChaskiPass" />
                    <FrequencyList />
                  </>
                </ProtectedRoute>

              }
            /> */}
            {/* <Route
              path="/register/linkStations"
              element={
                <ProtectedRoute requiredRole={['superAdmin', 'clerk']}>
                  <>
                    <PageTitle title="Enlazar estaciones | ChaskiPass" />
                    <LinkStationsRegistration />
                  </>
                </ProtectedRoute>

              }
            /> */}
          </Routes>
          <Toaster />
        </DefaultLayout>
      )}
    </>
  );
}

export default authInterceptor(App);
