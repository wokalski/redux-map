// @flow

type Action<T, U> = {
  type: T
} & U
type ActionMapper<S, T, U> = (state: S, action: Action<T, U>) => (Action<T, U> | Array<Action<T, U>>)

export function mappedActionsReducer<S, T, U>(
  originalReducer: (state: S, action: Action<T, U>) => S,
  actionMapper: ActionMapper<S, T, U>
): (state: S, action: Action<T, U>) => S {
  return (originalState: S, action: Action<T, U>): S => {
    const mappedActions = actionMapper(originalState, action)
    validateAction(mappedActions)
    if (Array.isArray(mappedActions)) {
      return mappedActions.reduce(
        (state, action) => {
          if (Array.isArray(action)) {
            throw new Error('Action cannot be an array')
          }
          validateAction(action)
          return originalReducer(state, action)
        },
        originalState
      )
    }
    return originalReducer(originalState, mappedActions)
  }
}

function validateAction(action) {
  if (typeof action === 'undefined') {
    throw new Error('Action cannot be null or undefined')
  } else if (!Array.isArray(action) 
    && typeof action.type === 'undefined') {
    throw new Error('action.type cannot be null or undefined')
  }
}

export function combineMappers<S, T, U>(...mapFunctions: Array<ActionMapper<S, T, U>>): ActionMapper<S, T, U> {
  return (state, action) => {
      return mapFunctions.map(
        (mapper) => mapper(state, action)
      ).reduce(
        (flattened, action) => {
          if (Array.isArray(action)) {
            return flattened.concat(action)
          }
          flattened.push(action)
          return flattened
        },
        []
      )
  }
}
