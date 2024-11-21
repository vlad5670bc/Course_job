    import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
    import Buffer from './components/Buffer';
    import Login from './components/Login';
    import Register from './components/Register';
    import Collections from './components/Collections';
    import CollectionDetails from './components/CollectionDetails';
    import CollectionsCadet from './components/CollectionsCadet'
    import CollectionsCommand from './components/CollectionsComand'
import EditDetails from './components/EditDocument';
    import Test from './components/Test';
    import Footer from './components/Footer';
    import Navbar from './components/Navbar';
    import { AuthProvider } from './components/AuthContext';// Import the Navbar
    import './css/login.css';

    const App = () => {
        const location = useLocation(); // Get the current location
        return (
            <AuthProvider>
                <>
                
                    {location.pathname !== '/login'
                        && location.pathname !== '/register'
                        && location.pathname !== '/collections/:collectionName/edit/:id'
                        && <Navbar />}
                <Routes>
                    <Route path="/" element={<Buffer />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/collections" element={<Collections />} />
                    <Route path="/collections/doctor/:name" element={<CollectionDetails />} />
                    <Route path="/collections/command/:name" element={<CollectionsCommand />} />
                    <Route path="/collections/cadet/:name" element={<CollectionsCadet />} />
                        <Route path="/collections/:collectionName/edit/:id" element={<EditDetails />} />
                        <Route path="/collections/:collectionName/test" element={ <Test/>}></Route>
                </Routes>
                <Footer />
            </>
            </AuthProvider>
        );
    };

    const Root = () => (
        <Router>
            <App />
        </Router>
    );

    export default Root;
