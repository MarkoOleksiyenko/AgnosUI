import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '../common/App';

import './app.css';

const components = import.meta.glob('./samples/*/*.route.tsx', {import: 'default'});

window.addEventListener('storage', (event) => {
	if (event.key === 'theme') {
		if (event.newValue) {
			document.documentElement.setAttribute('data-theme', event.newValue);
		}
	}
});

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App components={components} />
	</React.StrictMode>,
);
