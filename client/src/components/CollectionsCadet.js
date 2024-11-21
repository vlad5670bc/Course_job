import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../services/api';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function CollectionsCadet() {
    const { name } = useParams(); 
    const [collection, setCollection] = useState(null); 
    const [error, setError] = useState(null);

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

    // Utility function to calculate overall score
    const calculateOverallScore = (document) => {
        const { stressLevel, serviceSatisfaction, workLifeBalance } = document;
        const scores = [stressLevel, serviceSatisfaction, workLifeBalance];
        const validScores = scores.filter(score => score != null); // Filter out any null values
        if (validScores.length === 0) return 0; // Prevent division by zero
        const total = validScores.reduce((sum, score) => sum + score, 0);
        return (total / validScores.length).toFixed(2); // Round to 2 decimal places
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
    ];

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
                                        <td>{calculateOverallScore(document)}</td> 
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                    </div>
                )}
                <div>
                    <Link 
                        className='test-button'
                                to={{
                                    pathname: `/collections/${name}/test`,
                                }}
                                state={{ collectionName: name }}  // Pass collection name as state
                            >
                                <button>Пройти тест</button>
                            </Link>
                        </div>
            </div>
        </div>
    );
}

export default CollectionsCadet;
