import { createContext, useContext, useState, useCallback, useMemo } from 'react'

/**
 * Shared context that lets any "Hire me" / "اطلب خدمة" button open the
 * inquiry modal. The opener can pass a source (the video/series the user
 * clicked from) so it gets auto-attached to the message sent to Telegram.
 */
const InquiryContext = createContext({
  openInquiry: () => {},
  closeInquiry: () => {},
  isOpen: false,
  source: null,
})

export function InquiryProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [source, setSource] = useState(null)

  const openInquiry = useCallback((src = null) => {
    setSource(src)
    setIsOpen(true)
  }, [])

  const closeInquiry = useCallback(() => {
    setIsOpen(false)
    setSource(null)
  }, [])

  const value = useMemo(
    () => ({ openInquiry, closeInquiry, isOpen, source }),
    [openInquiry, closeInquiry, isOpen, source]
  )

  return <InquiryContext.Provider value={value}>{children}</InquiryContext.Provider>
}

export function useInquiry() {
  return useContext(InquiryContext)
}
