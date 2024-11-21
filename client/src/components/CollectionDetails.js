import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function CollectionDetails({ setCollectionName }) {
    const { name } = useParams(); 
    const [collection, setCollection] = useState(null); 
    const [error, setError] = useState(null);
    const [newDocument, setNewDocument] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [testResults, setTestResults] = useState([]);

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
        const fetchTestResults = async () => {
    try {
        const response = await api.get(`/api/collections/results`);
        
        // Log and check the structure of the response
        console.log("Fetched Test Results:", response.data); // For debugging
        
        // Check if response.data is an array, otherwise assign an empty array
        const data = Array.isArray(response.data) ? response.data : response.data.documents || [];
        
        setTestResults(data);
    } catch (err) {
        console.error('Error fetching test results:', err);
        setError(err);
        setTestResults([]); // Ensure fallback to empty array on error
    }
};



        if (name) {
            fetchCollectionDetails();
            fetchTestResults();
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
    const handleTestDelete = async (cadetName) => {
    if (window.confirm(`Are you sure you want to delete ${cadetName}?`)) {
        try {
            const encodedCadetName = encodeURIComponent(cadetName);
            const response = await api.delete(`/api/collections/test/delete/${encodedCadetName}`);
            alert(response.data.message);

            // Reload the page after successful deletion
            window.location.reload();
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

    const calculateOverallScore = (document) => {
        const { stressLevel, serviceSatisfaction, workLifeBalance } = document;
        const scores = [stressLevel, serviceSatisfaction, workLifeBalance];
        const validScores = scores.filter(score => score != null); 
        if (validScores.length === 0) return 0; 
        const total = validScores.reduce((sum, score) => sum + score, 0);
        return (total / validScores.length).toFixed(2); 
    };

    const handleCreateDocument = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post(`/api/collections/${name}/add`, newDocument);
            alert(response.data.message);

            const updatedResponse = await api.get(`/api/collections/${name}`);
            setCollection(updatedResponse.data);
            setNewDocument({});
            closeModal();
        } catch (error) {
            alert('Error creating document: ' + (error.response?.data?.message || error.message));
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        const modal = document.querySelector('.modal');
        modal.classList.add('exit');
        setTimeout(() => {
            setIsModalOpen(false);
            modal.classList.remove('exit');
        }, 500);
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

    const ranks = [
        'солдат',
        'ст. солдат',
        'мол. сержант',
        'сержант',
        'ст. сержант'
    ];

    const fieldNames = ['responsible_person',
        'rank',
        'stressLevel',
        'serviceSatisfaction',
        'workLifeBalance'];
    const fieldLabels = [
        'Відповідальна особа',
        'Звання',
        'Рівень стресу',
        'Задоволеність службою',
        'Баланс роботи'];



    return (
        <div className='collection-details-container'>
            <h2>Опитування в : {collection.title} групі</h2>

            <div className="details-and-form-container">
                {(!collection.documents || collection.documents.length === 0) ? (
                    <p>Колекція пуста</p>
                ) : (
                <div className='details-and-form-container-table'>
                    <table>
                        <thead>
                            <tr>
                                {Object.keys(collection.documents[0]).filter(key => key !== '_id').map((key, index) => (
                                    <th key={key}>{fieldLabels[index]}</th>
                                ))}
                                <th>Загальна оцінка</th>
                                <th>Редагувати</th>
                                <th>Видалити</th>
                            </tr>
                        </thead>
                        <tbody>
                            {collection.documents.map((document) => (
                                <tr key={document._id}>
                                    {Object.keys(document).map((key) => {
                                        if (key === '_id') return null;

                                        const value = key === 'dateOfEvaluation' 
                                            ? new Date(document[key]).toLocaleDateString() 
                                            : document[key];

                                        return (
                                            <td key={key}>{value}</td>
                                        );
                                    })}
                                    <td>{calculateOverallScore(document)}</td>
                                    <td className='link'>
                                        <Link to={`/collections/${name}/edit/${document._id}`}>Редагувати</Link>
                                    </td>
                                    <td className='details-and-form-container-table-delete'>
                                        <button className="delete-btn" onClick={() => handleDelete(document._id)}>Видалити</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                            </table>
                            <div className="test-results-container">
                                <h3>Результати тестування</h3>
                                
                            <table>
                                <thead>
                                    <tr>
                                        <th>Ім'я</th>
                                            <th>Статус</th>
                                            <th>Видал</th>
                                    </tr>
                                </thead>
                                <tbody>
    {Array.isArray(testResults) && testResults.length > 0 ? (
        testResults.map((result, index) => (
            <tr key={index}>
                <td>{result.cadetName}</td>
                <td>{result.results >= 15 ? 'Пройшов' : 'Не пройшов'}</td>
                <td className='details-and-form-container-table-delete'>
                    <button className="delete-btn" onClick={() => handleTestDelete(result.cadetName)}>Видалити</button>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="3">Немає результатів для відображення</td>
        </tr>
    )}
</tbody>

                            </table>
                        </div>
                </div>
                )}
                <div className='edit-details-container buttons'>
                    <button onClick={openModal}>Додати курсанта</button>
                    <Modal
    isOpen={isModalOpen}
    onRequestClose={closeModal}
    contentLabel="Add New Document"
    className="modal"
    overlayClassName="overlay"
>
    <h2>Додати курсанта</h2>
    <form onSubmit={handleCreateDocument}>
        {fieldNames.map((fieldName, index) => {
            const label = fieldLabels[index]; // Get corresponding label by index

            if (fieldName === 'rank') {
                return (
                    <div key={fieldName}>
                        <label htmlFor={fieldName}>{label}</label>
                        <select
                            id={fieldName}
                            className="rank"
                            name={fieldName}
                            value={newDocument[fieldName] || ''}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Виберіть звання</option>
                            {ranks.map((rank) => (
                                <option key={rank} value={rank}>
                                    {rank}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            } else {
                return (
                    <div key={fieldName}>
                        <label htmlFor={fieldName}>{label}</label>
                        <input
                            type="text"
                            id={fieldName}
                            name={fieldName}
                            value={newDocument[fieldName] || ''}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                );
            }
        })}
        <button className="edit-details-container-submit-btn" type="submit">
            Додати
        </button>
        <button className="edit-details-container-close-btn" type="button" onClick={closeModal}>
            Закрити
        </button>
    </form>
</Modal>


                    <button className='edit-details-container-export-btn' onClick={handleExport}>Зберегти файл</button>
                </div>
            </div>
            
        </div>
        
    );
}
export default CollectionDetails