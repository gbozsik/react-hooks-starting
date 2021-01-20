import React, { useEffect, useState } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  const { onLoadingredients } = props
  const [enteredFilter, setEnteredFilter] = useState('')

  useEffect(() => {
    const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
    fetch('https://react-hooks-update-adee4-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json' + query)
      .then(response => response.json())    // convert from json to js code
      .then(responseData => {
        const loadedIngredients = []
        for (const key in responseData) {
          console.log('responseData', responseData)
          console.log(responseData[key].title)
          console.log(responseData[key].amount)
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          })
        }
        onLoadingredients(loadedIngredients)
      })
  }, [enteredFilter, onLoadingredients])

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input type="text" 
          value={enteredFilter}
          onChange={event => setEnteredFilter(event.target.value)}/>
        </div>
      </Card>
    </section>
  );
});

export default Search;
