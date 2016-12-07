
import { 
  mappedActionsReducer,
  combineMappers
} from '../'

function mapToArray() {
  return [{
   type: '1'
  }, {
   type: '2'
  }]
}

function mapToNestedArray() {
  return [[]]
}

function mapToArrayWithNull() {
  return [{
    type: '1'
  }, null]
}

function mapToObject() {
  return {
    type: 't'
  }
}

function mapToObjectWithoutType() {
  return {}
}

function mapToUndefined() {
  return undefined
}

function mapToNull() {
  return null
}

function mapToSelf(state, action) {
  return action
}

describe("mapped actions reducer", () => {

  describe("passing actions", () => {
    let actions = []
    const originalReducer = (state, action) => {
      actions.push(action)
      return state
    }

    afterEach(() => actions = [])

    it("accepts with arrays", () => {
      mappedActionsReducer(originalReducer, mapToArray)()
      expect(actions).toEqual(mapToArray())
    })

    it("accepts with a single object", () => {
      mappedActionsReducer(originalReducer, mapToObject)()
      expect(actions).toEqual([mapToObject()])    
    })  

    it("throws when array contains nulls", () => {
      const reducer = mappedActionsReducer(originalReducer, mapToArrayWithNull)
      expect(() => reducer()).toThrow()
    })

    it("throws on undefined", () => {
      const reducer = mappedActionsReducer(originalReducer, mapToUndefined)
      expect(() => reducer()).toThrow()
    }) 

    it("throws on undefined", () => {
      const reducer = mappedActionsReducer(originalReducer, mapToNull)
      expect(() => reducer()).toThrow()
    })

    it("throws when no .type", () => {
      const reducer = mappedActionsReducer(originalReducer, mapToObjectWithoutType)
      expect(() => reducer()).toThrow()
    })

    it("throws when action is an array", () => {
      const reducer = mappedActionsReducer(originalReducer, mapToNestedArray)
      expect(() => reducer()).toThrow()
    })
  })
  
  describe("updating state", () => {
    
    let states = []
    const origReducer = (state, action) => {
      states.push(state)
      return action.type
    }

    afterEach(() => states = [])

    it("updates consicutevly with arrays", () => {
      const state = mappedActionsReducer(origReducer, mapToArray)('initial')
      expect(states).toEqual(['initial', '1'])
      expect(state).toEqual('2')
    })
    
    it("updates with a single mapped action", () => {
      const state = mappedActionsReducer(origReducer, mapToObject)('initial')
      expect(states).toEqual(['initial'])
      expect(state).toEqual('t')
    })

    it("updates with an action object", () => {
      const reducer = mappedActionsReducer(origReducer, mapToSelf)
      const state = reducer('initial', {type: 'action'})
      expect(states).toEqual(['initial'])
      expect(state).toEqual('action')
    })
  })

  it("passes state to action mapper", () => {
    let reducedState
    const actionMapper = (state, action) => {
      reducedState = state
      return action
    }
    const reducer = (state) => state
    mappedActionsReducer(reducer, actionMapper)('reducedState', {type: '1'})
    expect(reducedState).toEqual('reducedState')
  })
})

describe("combine actions", () => {
  const combined = combineMappers(mapToArray, mapToObject, mapToArray)('')
  expect(combined).toEqual([...mapToArray(), mapToObject(), ...mapToArray()])
})

