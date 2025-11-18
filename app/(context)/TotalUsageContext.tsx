"use client"
import { createContext, Dispatch, SetStateAction } from 'react'

export type TotalUsageContextValue = {
  totalUsage: number
  setTotalUsage: Dispatch<SetStateAction<number>>
}

export const TotalUsageContext = createContext<TotalUsageContextValue | null>(null)

