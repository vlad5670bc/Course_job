import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../services/api';
import '../css/login.css';

function Test() {
    const { name } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [responses, setResponses] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [score, setScore] = useState(0);
    const [cadetName, setCadetName] = useState(''); // New state for cadet name

    // Retrieve collection name from location state
    const collectionName = location.state?.collectionName || name;

    const questions = [
        { id: 1, text: "У складних ситуаціях я залишаюсь спокійним і можу раціонально оцінити, що відбувається." },
        { id: 2, text: "Коли я стикаюся з перешкодами або труднощами, я швидко знаходжу способи подолання або адаптації." },
        { id: 3, text: "Я вірю, що можу впоратися з більшістю проблем, навіть якщо вони здаються складними або незвичними." },
        { id: 4, text: "Я рідко відчуваю сильний стрес чи тривогу в напружених обставинах." },
        { id: 5, text: "Після невдач я здатен(на) швидко відновитися та повернутися до виконання своїх обов'язків." }
    ];

    const handleResponseChange = (questionId, value) => {
        setResponses((prevResponses) => ({
            ...prevResponses,
            [questionId]: parseInt(value),
        }));
    };

   const handleSubmit = async (e) => {
    e.preventDefault();
    const totalScore = Object.values(responses).reduce((acc, val) => acc + val, 0);
    setScore(totalScore);
    setShowResults(true);

    alert(`Cadet Name: ${cadetName} | Total Score: ${totalScore}`);

    // Save test result to the collection for this cadet using their name
    try {
        await api.post(`/api/collections/${name}/create`, {
            cadetName: cadetName, // Use cadet name instead of cadetId
            newResult: totalScore, // Make sure this matches your expected backend input
        });
        alert('Test results updated successfully!');
    } catch (error) {
        alert('Error updating test results: ' + error.message);
    }
};


    return (
        <div className="test-container">
            <h2>Тест на психологічну стійкість</h2>
            {!showResults ? (
                <form onSubmit={handleSubmit}>
                    <div className="cadet-name-input">
                        <label htmlFor="cadetName">Введіть своє ім'я:</label>
                        <input
                            type="text"
                            id="cadetName"
                            value={cadetName}
                            onChange={(e) => setCadetName(e.target.value)}
                            required
                        />
                    </div>
                    {questions.map((question) => (
                        <div key={question.id} className="question">
                            <p>{question.text}</p>
                            <div className="response-options">
                                {[1, 2, 3, 4, 5].map((num) => (
                                    <label key={num}>
                                        <input
                                            type="radio"
                                            name={`question-${question.id}`}
                                            value={num}
                                            checked={responses[question.id] === num}
                                            onChange={() => handleResponseChange(question.id, num)}
                                            required
                                        />
                                        {num}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                    <button type="submit">Здати</button>
                </form>
            ) : (
                <div className="results">
                    <h3>Твій бал: {score}</h3>
                    <button onClick={() => navigate(`/collections/cadet/${collectionName}`)}>Повернутися до списка</button>
                </div>
            )}
        </div>
    );
}

export default Test;
