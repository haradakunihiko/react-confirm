import React from 'react';
import confirm from '../util/confirm';

const handleOnClick = () => {
  confirm('Are you sure?').then(() => {
    console.log('proceed!') ;
  }, () => {
    console.log('cancel!');
  });
}

const Main = () => {
  return <button onClick={handleOnClick}></button>
}