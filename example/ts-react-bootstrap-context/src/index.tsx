import * as React from 'react'
import { render } from 'react-dom';
import App from './containers/App'
import { ThemeContext } from './context/context';
import { MountPoint } from './util/confirm';

render((
  <ThemeContext.Provider value="dark">
    <MountPoint/>
    <App></App>
  </ThemeContext.Provider>
  ), document.getElementById('root'));
