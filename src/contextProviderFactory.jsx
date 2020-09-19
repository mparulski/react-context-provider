import React from 'react'
import _ from 'lodash'

const getContextProvider = () => {
  const StateContext = React.createContext()
  const DispatchContext = React.createContext()

  const ContextProvider = ({children = null, reducer = state => state, initialValue = {}, callOnChange = []}) => {
    const [state, setState] = React.useState(initialValue)

    React.useEffect(() => {
      execCallOnChangeCallbacks(state, ...callOnChange)
    }, [JSON.stringify(state)])

    const dispatch = action => {
      const computedState = reducer(state, action)

      setState(computedState)
    }

    return (
      <StateContext.Provider value={state}>
        <DispatchContext.Provider value={dispatch}>{children}</DispatchContext.Provider>
      </StateContext.Provider>
    )
  }

  const useProviderState = (fn = state => state) => {
    const context = React.useContext(StateContext)

    if (context === undefined) {
      throw new Error('useProviderState must be used within a ContextProvider')
    }

    return fn(context)
  }

  const useProviderDispatch = () => {
    const context = React.useContext(DispatchContext)

    if (context === undefined) {
      throw new Error('useProviderDispatch must be used within a ContextProvider')
    }

    return context
  }

  const connect = (fn = state => state) => {
    return Component => {
      return props => {
        const state = useProviderState()
        const composedProps = {...props, ...fn(state)}

        return React.useMemo(() => <Component {...composedProps} />, [JSON.stringify(composedProps)])
      }
    }
  }

  return {ContextProvider, useProviderState, useProviderDispatch, connect}
}

const execCallOnChangeCallbacks = (state, ...callbacks) => {
  callbacks.map(cb => {
    const clonedState = _.clone(state)
    cb(clonedState)
  })
}

export default getContextProvider
