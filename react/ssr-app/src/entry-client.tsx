import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@agnos-ui/core-bootstrap/scss/agnosui.scss';

ReactDOM.hydrateRoot(
	document.getElementById('root')!,
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
setTimeout(() => {
	console.log('AGNOSUI-SSR-HYDRATION-COMPLETE');
});
