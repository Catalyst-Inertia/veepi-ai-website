import { createContext, useState, useContext } from 'react'

const TemplateContext = createContext({
  value: '',
  condition: false,
  someFunction: function () {},
  someFunctionWithVariable: function (_variable: string) {},
})

export function TemplateContextProvider(props: { children: React.ReactNode }) {
  const [isCondition, setIsCondition] = useState(false)
  function thisSetCondition() {
    setIsCondition(!isCondition)
  }

  const [value, setValue] = useState('')
  function thisSetValue(value: string) {
    setValue(value)
  }

  const context = {
    value: value,
    condition: isCondition,
    someFunction: thisSetCondition,
    someFunctionWithVariable: thisSetValue,
  }

  return (
    <TemplateContext.Provider value={context}>
      {props.children}
    </TemplateContext.Provider>
  )
}
export default TemplateContextProvider

export const useTemplateCtx = () => useContext(TemplateContext)
