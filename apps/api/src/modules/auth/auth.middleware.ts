import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '@perdinpro/types'

import { Role } from '../../generated/prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    res.status(401).json({ message: 'Access token required' })
    return
  }

  jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
    if (err) return res.sendStatus(403)
    ;(req as any).user = decoded as User
    // console.log('User:', req.user)
    next()
  })
}

export const requireRole = (roles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden: Insufficient permissions' })
      return
    }
    next()
  }
}
