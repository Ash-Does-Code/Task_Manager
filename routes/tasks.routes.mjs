import express from 'express';
const router = express.Router();
import authenticateToken from '../middleware/auth.mjs';
import { getTasks,
    postTask,
    updateTask,
    deleteTask} from '../controllers/task.controller.mjs';
// Define routes
router.get('/',authenticateToken,getTasks)
router.post("/", authenticateToken,postTask);
router.put('/:id',authenticateToken,updateTask);
router.delete('/:id',authenticateToken,deleteTask);
export default router;