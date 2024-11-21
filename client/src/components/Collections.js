import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from './AuthContext';

function Collections() {
    const [collections, setCollections] = useState([]);
    const { userRole } = useAuth();
    
    useEffect(() => {
        const fetchCollections = async () => {
            try {
                const res = await api.get('/api/collections'); 
                setCollections(res.data.collections); // Set collections from response
            } catch (error) {
                console.error('Error fetching collections:', error); // Log any errors
            }
        };
        fetchCollections();
    }, []);

    return (
        <div className='collections-container'>
            <h2>Підрозділи в яких було проведено опитування</h2>
            <ul>
                {collections
  .filter(
    (collection) =>
      collection.name !== "results" &&
      collection.name !== "tests" &&
      collection.name !== "testschemes"
  )
  .map((collection) => (
    <li key={collection.info.uuid}>
      <Link to={`/collections/${userRole}/${collection.name}`}>{collection.name}</Link>
    </li>
  ))}

            </ul>
        </div>
    );
}

export default Collections;
