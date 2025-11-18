"use client"
import { createContext, Dispatch, SetStateAction } from 'react'

export type UserSubscriptionContextValue = {
  userSubscription: boolean
  setUserSubscription: Dispatch<SetStateAction<boolean>>
}

export const UserSubscriptionContext =
  createContext<UserSubscriptionContextValue | null>(null)