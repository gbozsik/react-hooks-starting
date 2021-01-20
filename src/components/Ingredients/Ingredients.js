import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList'

function Ingredients() {
  const [ingredientsState, setIngredientsState] = useState([])

  const filterIngredientsHandler = useCallback(filteredIngredients => {
    setIngredientsState(filteredIngredients)
  }, [])

  const onAddIngredientHandler = (ingredient) => {
    fetch('https://react-hooks-update-adee4-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json', {
      method: 'POST',
      body: JSON.stringify({ ...ingredient }),
      headers: { 'Content-Type': 'application/json' }
    }).then(responseJson => {
      return responseJson.json()    // convert from json to js code
    }).then(responseData => {
      setIngredientsState(prevIngredients => [
        ...prevIngredients,
        { id: responseData.name, ...ingredient }
      ])
    })
  }

  return (
    <div className="App">
      <IngredientForm onAddIngredient={onAddIngredientHandler} />

      <section>
        <Search onLoadingredients={filterIngredientsHandler}/>
        <IngredientList ingredients={ingredientsState} onRemoveItem={() => { }} />
      </section>
    </div>
  );
}

export default Ingredients;
