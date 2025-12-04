import { Request, Response } from 'express'
import { PerdinService } from './perdin.service'
import { PerdinStatus } from '../../generated/prisma/client'

export class PerdinController {
  private perdinService: PerdinService

  constructor() {
    this.perdinService = new PerdinService()
  }

  createPerdin = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user.id // Assuming auth middleware attaches user
      const perdin = await this.perdinService.createPerdin(userId, req.body)
      res.status(201).json(perdin)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      res.status(400).json({ message })
    }
  }

  getAllPerdins = async (req: Request, res: Response) => {
    try {
      const user = (req as any).user
      const perdins = await this.perdinService.getAllPerdins(user.id, user.role)
      res.status(200).json(perdins)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ message })
    }
  }

  updateStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const { status } = req.body

      if (!['APPROVED', 'REJECTED'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' })
      }

      const perdin = await this.perdinService.updatePerdinStatus(id, status as PerdinStatus)
      res.status(200).json(perdin)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      res.status(500).json({ message })
    }
  }
}
