import * as React from 'react';
import { confirm, confirmComplex } from '../util/confirm';

const handleOnClick = async () => {
  if (await confirm({ confirmation: 'Are your sure?' })) {
    console.log('yes');
  } else {
    console.log('no');
  }
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
}

export default App;

