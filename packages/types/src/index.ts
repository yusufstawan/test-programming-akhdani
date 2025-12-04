export enum Role {
  PEGAWAI = 'PEGAWAI',
  SDM = 'SDM',
  ADMIN = 'ADMIN',
}

export enum PerdinStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface User {
  id: string
  username: string
  role: Role
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface City {
  id: string
  name: string
  latitude: number
  longitude: number
  province: string
  island: string
  isOverseas: boolean
  createdAt?: string | Date
  updatedAt?: string | Date
}

export interface Perdin {
  id: string
  userId: string
  purpose: string
  startDate: string | Date
  endDate: string | Date
  originCityId: string
  destCityId: string
  totalDays: number
  distance: number
  totalAllowance: number
  status: PerdinStatus
  createdAt?: string | Date
  updatedAt?: string | Date

  // Relations (optional as they might not always be included)
  user?: User
  originCity?: City
  destCity?: City
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  statusCode?: number
}
