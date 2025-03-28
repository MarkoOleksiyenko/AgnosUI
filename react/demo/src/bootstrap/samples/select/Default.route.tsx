import {Select} from '@agnos-ui/react-bootstrap/components/select';
import {useCallback, useState} from 'react';

const wordsA = ['apple', 'apricot', 'asparagus', 'astronaut', 'athletic', 'autumn', 'avocado'];
const wordsB = ['banana', 'baseball', 'basketball', 'beautiful', 'bedroom', 'bee', 'bicycle'];
const wordsC = ['cat', 'caterpillar', 'cave', 'chair', 'cheese', 'cherry', 'chicken'];
const mainList = [...wordsA, ...wordsB, ...wordsC];

const Default = () => {
	const [items, setItems] = useState([] as string[]);
	const [filterTextProp, setFilterTextProp] = useState(undefined as string | undefined);
	const onFilterTextChange = useCallback((filterText: string) => {
		setFilterTextProp(filterText);
		setItems(filterText ? mainList.filter((item) => item.toLowerCase().startsWith(filterText)) : mainList.slice(0, 10));
	}, []);
	return (
		<div style={{height: '400px'}}>
			<div className="mb-3">
				<Select items={items} filterText={filterTextProp} onFilterTextChange={onFilterTextChange} badgeClassName="badge text-bg-light" />
			</div>
		</div>
	);
};
export default Default;
