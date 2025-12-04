import { Router } from 'express'
import { MasterController } from './master.controller'
import { authenticateToken, requireRole } from '../auth/auth.middleware'

const router = Router()
const masterController = new MasterController()

router.get('/cities', authenticateToken, masterController.getAllCities)
router.post(
  '/cities',
  authenticateToken,
  requireRole(['ADMIN', 'SDM']),
  masterController.createCity
)
router.patch(
  '/cities/:id',
  authenticateToken,
  requireRole(['ADMIN', 'SDM']),
  masterController.updateCity
)
router.delete(
  '/cities/:id',
  authenticateToken,
  requireRole(['ADMIN', 'SDM']),
  masterController.deleteCity
)

export default router
