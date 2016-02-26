import React from 'react';
import confirm from 'util/confirm';

const handleOnClick = () => {
  confirm('Are you sure?').then(() => {
    console.log('proceed!') ;
  }, () => {
    console.log('cancel!');
  });
}

const App = () => {
  return <button onClick={handleOnClick}>save</button>;
}

export default App;
