// TestResultsController.js
import TestResultsService from './TestResultsService.js';

class TestResultsController {
    // Update test results for a specific cadet
    async updateResults(req, res) {
        try {
            const { cadetName, newResult } = req.body;

            // Update the cadet's results using the service
            const updatedCadet = await TestResultsService.updateResults(cadetName, newResult);

            if (!updatedCadet) {
                return res.status(404).json({ message: 'Cadet not found' });
            }

            res.status(200).json({ message: 'Test results updated successfully!', updatedCadet });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error updating test results', error: error.message });
        }
    }
    async create(req, res) {
        try {
            const { cadetName, newResult } = req.body;

            // Create the test result using the service
            const createdPost = await TestResultsService.create(cadetName, newResult);

            res.status(200).json({ message: 'Post created successfully', createdPost });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error creating test results', error: error.message });
        }
    }
    // TestResultsController.js
    async getResults(req, res) {
        try {
        const results = await TestResultsService.getResults();
        res.status(200).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching test results', error: error.message });
    }
    }
    async delete(req, res) {
    try {
        const { cadetName } = req.params;
        console.log("Deleting cadet:", cadetName); // Log the cadetName to confirm it's received

        if (!cadetName) {
            console.error("cadetName parameter missing");
            return res.status(400).json({ message: 'cadetName is required' });
        }

        const result = await TestResultsService.delete(cadetName);
        console.log("Delete result:", result); // Log the result to see if it was successful

        if (!result || result.deletedCount === 0) {
            return res.status(404).json({ message: 'Cadet not found or already deleted' });
        }

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error(`Error deleting cadet :`, error); // Log the specific error
        res.status(500).json({ message: 'Error deleting test results', error: error.message });
    }
}




}


export default new TestResultsController();
