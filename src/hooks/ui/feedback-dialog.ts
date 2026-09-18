import { create } from 'zustand'

export type FeedbackType = 'success' | 'error'

interface FeedbackDialogState {
  isOpen: boolean
  type: FeedbackType
  message: string
  description: string
  open: (type: FeedbackType, message: string, description: string) => void
  close: () => void
}

export const useFeedbackDialogStore = create<FeedbackDialogState>((set) => ({
  isOpen: false,
  type: 'success',
  message: '',
  description: '',
  open: (type, message, description) =>
    set({
      isOpen: true,
      type,
      message,
      description,
    }),
  close: () => set({ isOpen: false }),
}))

export function useFeedbackDialog() {
  const open = useFeedbackDialogStore((s) => s.open)
  const close = useFeedbackDialogStore((s) => s.close)
  const isOpen = useFeedbackDialogStore((s) => s.isOpen)
  const type = useFeedbackDialogStore((s) => s.type)
  const message = useFeedbackDialogStore((s) => s.message)
  const description = useFeedbackDialogStore((s) => s.description)
  return { open, close, isOpen, type, message, description }
}
