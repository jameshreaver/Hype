import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Document from './components/Document';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Document />, document.getElementById('doc'));
registerServiceWorker();
