import { Router } from 'express'
import { UserController } from './users.controller'
import { authenticateToken, requireRole } from '../auth/auth.middleware'
import { Role } from '../../generated/prisma/client'

const router = Router()
const userController = new UserController()

router.get('/', authenticateToken, requireRole([Role.ADMIN, Role.SDM]), userController.getAllUsers)
router.get(
  '/:id',
  authenticateToken,
  requireRole([Role.ADMIN, Role.SDM]),
  userController.getUserById
)
router.patch(
  '/:id/role',
  authenticateToken,
  requireRole([Role.ADMIN]),
  userController.updateUserRole
)

export default router
