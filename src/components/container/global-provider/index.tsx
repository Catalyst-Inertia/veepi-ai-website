import antdTheme from '@/config/antdTheme'
import GlobalContextProvider from '@/context'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'

export default function GlobalProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5,
      },
    },
  })

  return (
    <AntdRegistry>
      <ConfigProvider theme={antdTheme}>
        <QueryClientProvider client={queryClient}>
          <GlobalContextProvider>{children}</GlobalContextProvider>
        </QueryClientProvider>
      </ConfigProvider>
    </AntdRegistry>
  )
}
