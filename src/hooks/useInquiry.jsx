import { createContext, useContext, useState, useCallback, useMemo } from 'react'






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
