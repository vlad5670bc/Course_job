// routes/api.js
import Router from 'express';
import PostController from './PostController.js';
import AccountsController from './AccountsController.js';
import TestResultsController from './TestResultsController.js'; // Import the TestResultsController

const router = new Router();

// Existing routes...
router.get('/login', AccountsController.login);
router.post('/login', AccountsController.loginValidate);
router.get('/usersRole', AccountsController.getUserRole);

router.get('/register', AccountsController.register);
router.post('/register', AccountsController.createAccount);
router.get('/collections', PostController.getCollections);
router.get('/collections/:collectionName', PostController.getCollection);
router.post('/collections/:collectionName/add', PostController.create);
router.post('/collections/:collectionName/delete', PostController.delete);
router.get('/collections/:collectionName/edit', PostController.edit);
router.post('/collections/:collectionName/update', PostController.update);
router.get('/collections/:collectionName/export', PostController.export);

// New route for updating test results
// your router file
router.get('/collections/results', TestResultsController.getResults);
router.delete('/collections/test/delete/:cadetName', TestResultsController.delete);
router.post('/collections/:collectionName/create', TestResultsController.create);


export default router;
