import TemplateContextProvider from './_example'

export default function GlobalContextProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return <TemplateContextProvider>{children}</TemplateContextProvider>
}
