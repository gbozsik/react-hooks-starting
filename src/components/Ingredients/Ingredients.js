import React, { useState, useReducer, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'
import ErrorModal from '../UI/ErrorModal'

const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case 'SET':
      return action.ingredients
    case 'ADD':
      return [...currentIngredients, action.ingredient]
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id)
    default:
      throw new Error('Should not get here')
  }
}

const httpReducer = (currenthttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return { loading: true, error: null }
    case 'RESPONSE':
      return { ...currenthttpState, loading: false }  // ...httpState is to copy everythig from the previous state to not loose antyhing and just override the "loading" prop
    case 'ERROR':
      return { error: action.errorData, loading: false }
    case 'CLEAR':
      return { ...currenthttpState, error: null }
    default:
      throw new Error('should not get here')
  }
}

function Ingredients() {
  const [ingredientsState, dispatch] = useReducer(ingredientReducer, [])
  const [httpState, dispatchHttp] = useReducer(httpReducer, [])
  // const [ingredientsState, setIngredientsState] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()

  const filterIngredientsHandler = useCallback(filteredIngredients => {
    // setIngredientsState(filteredIngredients)
    dispatch({ type: 'SET', ingredients: filteredIngredients })
  }, [])

  const onAddIngredientHandler = (ingredient) => {
    // setIsLoading(true)
    dispatchHttp({ type: 'SEND' })
    fetch('https://react-hooks-update-adee4-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json', {
      method: 'POST',
      body: JSON.stringify({ ...ingredient }),
      headers: { 'Content-Type': 'application/json' }
    }).then(responseJson => {
      // setIsLoading(false)
      dispatchHttp({ type: 'RESPONSE', })
      return responseJson.json()    // convert from json to js code
    }).then(responseData => {
      // setIngredientsState(prevIngredients => [
      //   ...prevIngredients,
      //   { id: responseData.name, ...ingredient }
      // ])
      dispatch({ type: 'ADD', ingredient: { id: responseData.name, ...ingredient } })
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', errorData: error.message })
      // setError(error.message)
      // setIsLoading(false)

    })
  }

  const onRemoveIngredientHandler = (ingredientId) => {
    // setIsLoading(true)
    dispatchHttp({ type: 'SEND' })
    fetch(`https://react-hooks-update-adee4-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`, {
      method: 'DELETE',
    }).then(responseData => {
      // setIsLoading(false)
      // setIngredientsState(prevIngredients =>
      //   prevIngredients.filter(ingredient => ingredient.id !== ingredientId)
      // );
      dispatchHttp({ type: 'RESPONSE', })
      dispatch({ type: 'DELETE', id: ingredientId })
    }).catch(error => {
      dispatchHttp({ type: 'ERROR', errorData: error.message })
      // setError(error.message)
      // setIsLoading(false)
    })
  }

  const clearError = () => {
    // setError(null)
    dispatchHttp({type: 'CLEAR'})
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}

      <IngredientForm onAddIngredient={onAddIngredientHandler} loading={httpState.loading} />

      <section>
        <Search onLoadingredients={filterIngredientsHandler} />
        <IngredientList ingredients={ingredientsState} onRemoveItem={(onRemoveIngredientHandler)} />
      </section>
    </div>
  );
}

export default Ingredients;
