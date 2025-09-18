import type {SidenavApi} from '@agnos-ui/react-bootstrap/components/sidenav';
import {Sidenav} from '@agnos-ui/react-bootstrap/components/sidenav';
import type {TreeSlotItemContext} from '@agnos-ui/react-bootstrap/components/tree';
import {Tree, type TreeItem} from '@agnos-ui/react-bootstrap/components/tree';
import {useDirective} from '@agnos-ui/react-bootstrap/utils/directive';
import {useRef, useState} from 'react';

interface SideNavItem extends TreeItem {
	href?: string;
}

type TreeData = {
	collapsed: boolean;
};

const BasicDemo = () => {
	const [collapsed, setCollapsed] = useState(false);
	const [contentData, setContentData] = useState({collapsed});
	const sidenav = useRef<SidenavApi>(null);
	const items: TreeItem<SideNavItem>[] = [
		{
			label: 'Node 1',
			isExpanded: true,
			children: [
				{
					label: 'Node 1.1',
					children: [
						{
							label: 'Node 1.1.1',
							href: 'google.com',
						},
					],
				},
				{
					label: 'Node 1.2',
					children: [
						{
							label: 'Node 1.2.1',
							href: 'https://design-factory.amadeus.net/',
						},
					],
				},
			],
		},
	];
	return (
		<div className="d-flex" style={{height: '400px'}}>
			<Sidenav
				ref={sidenav}
				footer={
					<button
						className="btn btn-primary m-2"
						onClick={() => {
							sidenav.current!.toggle();
							setCollapsed((c) => {
								const next = !c;
								setContentData({collapsed: next});
								return next;
							});
						}}
					>
						+
					</button>
				}
			>
				<Tree nodes={items} itemContent={CustomTreeItem} contentData={contentData} />
			</Sidenav>
			<div className="main-content">
				<h1>Main content</h1>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisi nisl aliquam erat, nec facilisis
					erat urna eu sapien. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vivamus dictum, enim at
					cursus dictum, urna erat cursus erat, ac dictum enim urna eu erat. Nullam euismod, nisi eu consectetur cursus, nisl nisl aliquam erat, nec
					facilisis erat urna eu sapien. Suspendisse potenti. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam erat, nec facilisis erat
					urna eu sapien. Mauris dictum, enim at cursus dictum, urna erat cursus erat, ac dictum enim urna eu erat. Proin euismod, nisi eu consectetur
					cursus, nisl nisl aliquam erat, nec facilisis erat urna eu sapien. Quisque dictum, enim at cursus dictum, urna erat cursus erat, ac dictum
					enim urna eu erat. Fusce euismod, nisi eu consectetur cursus, nisl nisl aliquam erat, nec facilisis erat urna eu sapien.
				</p>
			</div>
		</div>
	);
};

export default BasicDemo;

const CustomTreeItem = (slotContext: TreeSlotItemContext<TreeData>) => {
	const {item, directives, state} = slotContext;
	console.log('collapsed', state.contentData.collapsed);
	return (
		<div className="au-tree-item">
			{item.children.length > 0 ? (
				<button className="d-flex w-100 px-1" {...useDirective(directives.itemToggleDirective, {item})}>
					<span>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-house" viewBox="0 0 16 16">
							<path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
						</svg>
					</span>
					{!slotContext.state.contentData.collapsed && (
						<>
							<span className="me-auto">{item.label}</span>
							<span className="au-tree-expand-icon-svg"></span>
						</>
					)}
				</button>
			) : (
				<a className="btn d-flex w-100 px-1" href={(item as any).href}>
					<span className="me-auto">{item.label}</span>
					<span className="au-tree-expand-icon-placeholder"></span>
				</a>
			)}
		</div>
	);
};
