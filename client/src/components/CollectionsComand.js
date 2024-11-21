import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function CollectionsCommand() {
    const { name } = useParams(); 
    const [collection, setCollection] = useState(null); 
    const [error, setError] = useState(null);
    const [newDocument, setNewDocument] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCollectionDetails = async () => {
            try {
                const response = await api.get(`/api/collections/${name}`);
                setCollection(response.data); 
            } catch (err) {
                console.error(err);
                setError(err);
            }
        };

        if (name) {
            fetchCollectionDetails();
        }
    }, [name]);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                const response = await api.post(`/api/collections/${name}/delete`, { id });
                alert(response.data.message);

                const updatedResponse = await api.get(`/api/collections/${name}`);
                setCollection(updatedResponse.data);
            } catch (error) {
                alert('Error deleting document: ' + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDocument(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    // Utility function to calculate overall score
    const calculateOverallScore = (document) => {
        const { stressLevel, serviceSatisfaction, workLifeBalance } = document;
        const scores = [stressLevel, serviceSatisfaction, workLifeBalance];
        const validScores = scores.filter(score => score != null); // Filter out any null values
        if (validScores.length === 0) return 0; // Prevent division by zero
        const total = validScores.reduce((sum, score) => sum + score, 0);
        return (total / validScores.length).toFixed(2); // Round to 2 decimal places
    };

    const handleExport = async () => {
        try {
            const response = await api.get(`/api/collections/${name}/export`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${name}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            alert('Error exporting documents: ' + (error.response?.data?.message || error.message));
        }
    };

    if (error) {
        return <div className="error-message">Error: {error.message}</div>;
    }

    if (!collection) {
        return <div>Loading...</div>;
    }

    const fielsName = [
        'Опитувана особа',
        'Звання',
        'Рівень стресу',
        'Задоволеність службою',
        'Життєвий рівень'
    ]
    return (
        <div className='collection-details-container'>
            
            <h2>Опитування в : {collection.title} групі</h2>

            <div className="details-and-form-container">
                {(!collection.documents || collection.documents.length === 0) ? (
                    <p>Колекція порожня</p>
                ) : (
                <div className='details-and-form-container-table'>
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(collection.documents[0]).filter(key => key !== '_id').map((key,index) => (
                                    <th key={key}>{fielsName[index]}</th>
                                ))}
                                        <th>Загальна оцінка</th>
                                        <th>Придатність</th>
                            </tr>
                        </thead>
                        <tbody>
                            {collection.documents.map((document) => (
                                <tr key={document._id}>
                                    {Object.keys(document).map((key) => {
                                        // Skip the _id field, as it's not needed in the table
                                        if (key === '_id') return null;

                                        // Format the date if the key is 'dateOfEvaluation'
                                        const value = key === 'dateOfEvaluation' 
                                            ? new Date(document[key]).toLocaleDateString() 
                                            : document[key];

                                        return (
                                            <td key={key}>{value}</td>
                                        );
                                    })}
                                    <td>{calculateOverallScore(document)}</td> {/* Calculate and display overall score */}
                                    <td>
                                        <div className={
                                            calculateOverallScore(document) <= 5
                                                ? 'notPropper'
                                                : 'propper'
                                        }>
                                            {calculateOverallScore(document) <=5 ? 'Не придатний' : 'Придатний' }
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )}
                <div className='edit-details-container command'>
                    <button className='edit-details-container-export-btn' onClick={handleExport}>Зберегти файл</button>
                </div>
            </div>
        </div>
    );
}

export default CollectionsCommand;
