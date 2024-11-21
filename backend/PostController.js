import { copyFileSync } from 'fs';
import PostService from './PostService.js';

class PostController {
    // Create a new post in the specified collection
    async create(req, res) {
        try {
            const post = await PostService.create(req.body, req.params.collectionName);
            if (post) {
                // Inform React about the success and provide the collection URL for further navigation
                return res.status(200).json({ message: 'Post created successfully', redirect: `/api/collections/${req.params.collectionName}` });
            } else {
                res.status(400).json({ message: 'Something went wrong!' });
            }
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // Get all collections (send as JSON for React to render)
    async getCollections(req, res) {
        try {
            console.log("getCollections")
            const collections = await PostService.getCollections();
            return res.status(200).json({collections});
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // Get a specific collection
    async getCollection(req, res) {
        try {
            const isAdmin = req.session.isAdmin;
            console.log("Collection isAdmin:", isAdmin);
            const documents = await PostService.getCollection(req.params.collectionName);
            
            // Respond with documents and isAdmin flag for React to render appropriate view
            return res.status(200).json({ title: req.params.collectionName, documents, isAdmin });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // Edit a document in a collection
    async edit(req, res) {
        try {
            const document = await PostService.edit(req.query.id, req.params.collectionName);
            const schemaPaths = document.schema.paths;
            const cleanDocument = {};

            // Filter out the undefined fields
            for (const key in schemaPaths) {
                if (document[key] !== undefined) {
                    cleanDocument[key] = document[key];
                }
            }

            // Send the document and schema information to React for rendering the form
            return res.status(200).json({
                title: `Edit Document (ID: ${document._id})`,
                collectionName: req.params.collectionName,
                document: cleanDocument
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    // Update a document and send JSON response
    async update(req, res) {
        try {
            const updatedDocument = await PostService.update(req.body, req.params.collectionName);
            if (updatedDocument) {
                // Inform React about the successful update
                return res.status(200).json({ message: 'Document updated successfully', redirect: `/api/collections/${req.params.collectionName}` });
            } else {
                return res.status(404).json({ message: 'Document not found' });
            }
        } catch (e) {
            res.status(500).json({ error: "Controller " + e.message });
        }
    }

    // Delete a document
    async delete(req, res) {
        try {
            const post = await PostService.delete(req.params.collectionName, req.body.id);
            if (post) {
                // Inform React about successful deletion
                res.status(200).json({ message: 'Document deleted successfully', redirect: `/api/collections/${req.params.collectionName}` });
            } else {
                res.status(404).json({ message: 'Document not found' });
            }
        } catch (e) {
            res.status(500).json({ error: 'Service error ' + e.message });
        }
    }

    // Export a collection as a file (keep the download)
    async export(req, res) {
        try {
            const { fs, outputFilePath } = await PostService.export(req.params.collectionName);

            if (outputFilePath) {
                // Initiate file download
                res.download(outputFilePath, 'duties.xlsx', (err) => {
                    if (err) {
                        console.error('Error during file download:', err);
                        res.status(500).json({ message: 'Error during file download' });
                    }
                    fs.unlinkSync(outputFilePath); // Clean up the file after download
                });
            } else {
                return res.status(404).json({ message: 'Document not found' });
            }
        } catch (e) {
            console.error('Controller error:', e);
            res.status(500).json({ message: 'Controller error: ' + e.message });
        }
    }
}

export default new PostController();
