import { Router } from 'express'
import { MasterController } from './master.controller'
import { authenticateToken, requireRole } from '../auth/auth.middleware'
import { Role } from '../../generated/prisma/enums'

const router = Router()
const masterController = new MasterController()

router.get('/cities', authenticateToken, masterController.getAllCities)
router.post(
  '/cities',
  authenticateToken,
  requireRole([Role.ADMIN, Role.SDM]),
  masterController.createCity
)
router.patch(
  '/cities/:id',
  authenticateToken,
  requireRole([Role.ADMIN, Role.SDM]),
  masterController.updateCity
)
router.delete(
  '/cities/:id',
  authenticateToken,
  requireRole([Role.ADMIN, Role.SDM]),
  masterController.deleteCity
)

export default router
