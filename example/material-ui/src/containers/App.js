import React from 'react';
import confirm from '../util/confirm';
import Theme from '../theme'

const handleOnClick = () => {
  confirm({confirmation: 'Are you sure?'}).then(() => {
    console.log('proceed!') ;
  }, () => {
    console.log('cancel!');
  });
}

const App = () => {
  return <button onClick={handleOnClick}>save</button>;
}

export default App;
