import type {DrawerApi} from '@agnos-ui/react-bootstrap/components/drawer';
import {Drawer} from '@agnos-ui/react-bootstrap/components/drawer';
import {useRef, useState} from 'react';

type DrawerTypes = 'inline-start' | 'inline-end' | 'block-start' | 'block-end';

const BasicDemo = () => {
	const [placement, setPosition] = useState<DrawerTypes>('inline-start');
	const refDrawer = useRef<DrawerApi>(null);

	function toggle() {
		refDrawer.current?.open();
	}

	return (
		<>
			<button className="btn btn-primary mb-3" onClick={toggle}>
				Toggle drawer
			</button>
			<div className="d-flex align-items-center">
				<label htmlFor="drawer-placement" className="me-3">
					Placement:
				</label>
				<select id="drawer-placement" className="w-auto form-select" onChange={(e) => setPosition(e.target.value as DrawerTypes)} value={placement}>
					<option value="inline-start">Left</option>
					<option value="inline-end">Right</option>
					<option value="block-start">Top</option>
					<option value="block-end">Bottom</option>
				</select>
			</div>
			<Drawer ref={refDrawer} className={placement} header={<>Hi, I am drawer!</>}>
				<ul>
					<li>First item</li>
					<li>Second item</li>
					<li>Third item</li>
				</ul>
			</Drawer>
		</>
	);
};

export default BasicDemo;
