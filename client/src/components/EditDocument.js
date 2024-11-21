import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';  // Assuming 'api' is an Axios instance configured to call your backend

function EditDetails() {
    const { collectionName, id } = useParams();  // Get both collectionName and document ID from the URL
    const [document, setDocument] = useState(null);  // State to hold the document data
    const [formData, setFormData] = useState({});  // State to hold form data for editing
    const [error, setError] = useState(null);  // Error state
    const navigate = useNavigate();  // Navigation hook to redirect after update

    // Fetch document when component loads
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                // Call the API to fetch the document
                const response = await api.get(`/api/collections/${collectionName}/edit?id=${id}`);
                setDocument(response.data.document);  // Set the fetched document in state
                setFormData(response.data.document);  // Pre-fill the form with the document data
            } catch (err) {
                console.error(err);
                setError(err);
            }
        };

        if (id && collectionName) {
            fetchDocument();  // Fetch document if there's a valid ID and collection name
        }
    }, [id, collectionName]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Handle form submission to update the document
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call the API to update the document
            const response = await api.post(`/api/collections/${collectionName}/update`, formData);
            // If successful, navigate back to the collection view
            if (response.status === 200) {
                navigate(`/collections/doctor/${collectionName}`);
            }
        } catch (err) {
            console.error(err);
            setError(err);
        }
    };

    if (error) {
        return <div className="error-message">Error: {error.message}</div>;
    }

    if (!document) {
        return <div>Loading...</div>;
    }
const fieldsName = [
        'Опитувана особа',
        'Звання',
        'Рівень стресу',
        'Задоволеність службою',
        'Життєвий рівень'
    ];
    return (
        <div className="edit-details-container">
            <div className='link'>
                <Link to={`/collections/doctor/${collectionName}`}>Повернутись до групи</Link>
            </div>
            <h2>Редагування</h2> 
            
            <form onSubmit={handleSubmit}>
                <div className="edit-details-container-form"> 
                    {Object.keys(document).filter(key => key !== '_id').map((key,index) => (
                    <div key={key}>
                        <label>{fieldsName[index]}:</label>
                        <div>
                            <input
                            type="text"
                            name={key}
                            value={formData[key] || ''}  
                            onChange={handleInputChange}
                        />
                        </div>
                    </div>
                ))}</div>
                <button type="submit">Зберегти зміни</button>
            </form>
            
        </div>
    );
}

export default EditDetails;
