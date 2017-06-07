import React from 'react';
import { confirm, confirmComplex } from 'util/confirm';

const handleOnClick = () => {
  confirm('Are you sure?').then(() => {
    console.log('proceed!') ;
  }, () => {
    console.log('cancel!');
  });
}

const handleOnClickComplex = () => {
  confirmComplex({ message: 'hello' }).then(({ button, input }) => {
    console.log('proceed! pressed:' + button + ' input:' + input);
  }, () => {
    console.log('cancel!');
  });
}

const App = () => {
  return (
    <div>
      <button onClick={handleOnClick}>simple</button>
      <button onClick={handleOnClickComplex}>complex</button>
    </div>
  );

  return 
}

export default App;