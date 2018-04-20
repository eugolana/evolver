import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App  width="1100" height="550" num_x="8" num_y="4" genomeLength="512"/>, document.getElementById('root'));
registerServiceWorker();
