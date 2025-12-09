import { Router } from 'express'
import { PerdinController } from './perdin.controller'
import { authenticateToken, requireRole } from '../auth/auth.middleware'
import { Role } from '../../generated/prisma/client'

const router = Router()
const perdinController = new PerdinController()

router.post('/', authenticateToken, perdinController.createPerdin)
router.get('/', authenticateToken, perdinController.getAllPerdins)
router.patch(
  '/:id/status',
  authenticateToken,
  requireRole([Role.SDM]),
  perdinController.updateStatus
)

export default router
