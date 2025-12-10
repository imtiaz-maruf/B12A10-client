import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import ErrorPage from '../pages/ErrorPage';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import PrivateRoute from '../utils/PrivateRoute';
import AllServices from '../pages/AllServices';
import ServiceDetails from '../pages/ServiceDetails';
import AddService from '../pages/AddService';
import MyServices from '../pages/MyServices';
import EditService from '../pages/EditService';
import MyBookings from '../pages/MyBookings';
import MySchedule from '../pages/MySchedule';
import Profile from '../pages/Profile';

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/services',
                element: <AllServices />,
            },
            {
                path: '/services/:id',
                element: <ServiceDetails />,
            },
            {
                path: '/login',
                element: <Login />,
            },
            {
                path: '/register',
                element: <Register />,
            },
            {
                path: '/profile',
                element: <PrivateRoute><Profile /></PrivateRoute>,
            },
            {
                path: '/add-service',
                element: <PrivateRoute><AddService /></PrivateRoute>,
            },
            {
                path: '/my-services',
                element: <PrivateRoute><MyServices /></PrivateRoute>,
            },
            {
                path: '/edit-service/:id',
                element: <PrivateRoute><EditService /></PrivateRoute>,
            },
            {
                path: '/my-bookings',
                element: <PrivateRoute><MyBookings /></PrivateRoute>,
            },
            {
                path: '/my-schedule',
                element: <PrivateRoute><MySchedule /></PrivateRoute>,
            },
        ],
    },
]);

export default router;