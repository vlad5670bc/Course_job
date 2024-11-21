// TestResultsService.js
import TestScheme from './TestScheme.js'; // Adjust the import path as necessary
import mongoose from 'mongoose';
import DB_URL from './index.js';
class TestResultsService {
    constructor() {
        this.connection = null;
    }

    async connect() {
        if (!this.connection) {
            this.connection = await mongoose.connect(DB_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        }
    }
    // Update results for a specific cadet
    async updateResults(cadetName, newResult) {
        // Find the cadet by ID and update their results
        const updatedCadet = await TestScheme.findByIdAndUpdate(
            cadetName,
            { results: newResult }, // Update the results field
            { new: true } // Return the updated document
        );
        return updatedCadet;
    }
   async create(cadetName, newResult) {
        // Create a new document with cadetName and newResult
        const createdPost = await TestScheme.create({ cadetName, results: newResult });
        return createdPost;
    }
    async getResults() {
    try {
        await this.connect();
        // Use TestScheme to fetch all documents from the 'tests' collection
        const testResults = await TestScheme.find(); // Retrieve all documents
        return testResults; // Return the actual documents
    } catch (e) {
        console.error(e.message);
        throw new Error('Error fetching test results');
        }
        
    }
    async delete(cadetName) {
    try {
        await this.connect();
        const result = await TestScheme.deleteOne({ cadetName });
        console.log("Delete operation result:", result); // Log the result from delete operation
        return result;
    } catch (error) {
        console.error(`Failed to delete document for cadetName ${cadetName}:`, error);
        throw error; // This will propagate to the controller's catch block
    }
}

}

export default new TestResultsService();
