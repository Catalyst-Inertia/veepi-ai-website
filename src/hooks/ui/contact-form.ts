import { create } from 'zustand'

type ContactFormState = {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useContactFormStore = create<ContactFormState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}))

export function useContactForm() {
  const open = useContactFormStore((s) => s.open)
  const close = useContactFormStore((s) => s.close)
  const isOpen = useContactFormStore((s) => s.isOpen)
  return { open, close, isOpen }
}
