import type {Locator} from '@playwright/test';
import os from 'os';

export type HTMLAttribute = {name: string; value: string};
export type HTMLNode =
	| null
	| string
	| {
			tagName: string;
			childNodes: HTMLNode[];
			attributes: HTMLAttribute[];
	  };

export const htmlStructure = (locator: Locator): Promise<HTMLNode> =>
	locator.evaluate((element) => {
		const isElement = (node: Node): node is Element => node.nodeType === node.ELEMENT_NODE;
		const isInput = (node: Element): node is HTMLInputElement => node.tagName === 'INPUT';
		const isTextArea = (node: Element): node is HTMLTextAreaElement => node.tagName === 'TEXTAREA';
		const recFn = (node: Node) => {
			if (!isElement(node)) {
				if (node.nodeType === node.TEXT_NODE) {
					return node.nodeValue;
				}
				// Note: ignore comments
				return null;
			}
			const tagName = node.tagName.toLowerCase();
			const childNodes: HTMLNode[] = [];
			if (isTextArea(node)) {
				// only keep the actual current value of the textarea instead of the real attribute
				childNodes.push(node.value);
			} else {
				for (const child of node.childNodes) {
					const value = recFn(child);
					if (value != null) {
						childNodes.push(value);
					}
				}
			}
			const attributes: HTMLAttribute[] = [];
			const isNodeInput = isInput(node);
			const isNodeCheckboxOrRadio = isNodeInput && ['checkbox', 'radio'].includes(node.getAttribute('type')?.toLowerCase() ?? '');
			const isNodeInputNotCheckboxNorRadio = isNodeInput && !isNodeCheckboxOrRadio;
			// only keep the actual current value of the input in attributes instead of the real attribute
			// that only contains the initial value and may be present or not depending on the framework
			if (isNodeCheckboxOrRadio) {
				if (node.checked) {
					attributes.push({name: 'checked', value: 'checked'});
				}
			} else if (isNodeInput) {
				attributes.push({name: 'value', value: node.value});
			}
			const style = 'style' in node ? node.style : undefined;
			const styleAttributes = [];
			if (style instanceof CSSStyleDeclaration && style.length > 0) {
				// normalize style attribute:
				for (const name of style) {
					styleAttributes.push(`${name}: ${style.getPropertyValue(name)};`);
				}
				attributes.push({name: 'style', value: styleAttributes.join(' ')});
			}
			for (const {name, value} of node.attributes) {
				if (
					(isNodeCheckboxOrRadio && name === 'checked') ||
					(isNodeInputNotCheckboxNorRadio && name === 'value') ||
					(styleAttributes.length > 0 && name === 'style')
				) {
					continue;
				}
				attributes.push({name, value});
			}
			return {tagName, childNodes, attributes};
		};
		return recFn(element);
	});

const cleanChildNodes = (childNodes: HTMLNode[]) => {
	childNodes = [...childNodes];
	const result: HTMLNode[] = [];
	while (childNodes.length) {
		let newValue = childNodes.shift();
		if (!newValue) continue;
		if (typeof newValue === 'string') {
			const previousValue = result[result.length - 1];
			if (typeof previousValue === 'string') {
				result.pop();
				newValue = previousValue + newValue;
			}
		} else if (newValue.tagName === '') {
			// only keep descendants
			childNodes.unshift(...newValue.childNodes);
			continue;
		}
		result.push(newValue);
	}
	return removeWhiteSpace(result);
};

const removeWhiteSpace = (childNodes: HTMLNode[]) =>
	childNodes.map((item) => (typeof item === 'string' ? item.replace(/\s+/g, ' ').trim() : item)).filter((item) => !!item);

const compare = (a: number | string, b: number | string) => (a < b ? -1 : a > b ? 1 : 0);
const compareName = ({name: a}: {name: string}, {name: b}: {name: string}) => compare(a, b);

const spaceRegExp = /\s+/;
const excludeClassRegExp = /^(s|svelte|ng)-/;
const excludeAttrRegExp = /^(ng-|_ng|ngh$|au|app|data-svelte(kit)?-)/;
const attrExceptions = ['autocapitalize', 'autocomplete', 'autocorrect'];
const booleanAttributes = new Set(['checked', 'disabled', 'inert', 'readonly']);

const removeTagsAndDescendants = new Set(['script', 'router-outlet']);
const tagReplacements = new Map([
	['app-root', ''],
	['ng-component', ''],
	['au-component', ''],
]);
const filterTagName = (tagName: string, attributes: HTMLAttribute[]) => {
	const mapResult = tagReplacements.get(tagName);
	if (mapResult != null) {
		return mapResult;
	}
	if (tagName.startsWith('app-')) {
		return '';
	}
	if (tagName === 'link' && attributes.some((attr) => attr.name === 'rel' && (attr.value === 'modulepreload' || attr.value === 'preload'))) {
		return '';
	}
	return tagName;
};

const ignoreEmblaStyles = (
	attr: HTMLAttribute,
	node: {
		tagName: string;
		childNodes: HTMLNode[];
		attributes: HTMLAttribute[];
	},
) => {
	return (
		attr.name === 'style' &&
		(node.attributes.find((attr) => attr.name === 'class')?.value?.includes('au-carousel-container') ||
			node.attributes.find((attr) => attr.name === 'class')?.value?.includes('autoplay-progress-bar '))
	);
};

export const filterHtmlStructure = (node: HTMLNode): HTMLNode => {
	// only keep what we want to compare
	if (!node || typeof node === 'string') {
		return node;
	}
	let {tagName, attributes, childNodes} = node;
	if (removeTagsAndDescendants.has(tagName)) {
		return null;
	}
	tagName = filterTagName(tagName, attributes);
	if (tagName == '') {
		attributes = [];
	}
	attributes = attributes
		.filter((attr) => !(ignoreEmblaStyles(attr, node) || (excludeAttrRegExp.test(attr.name) && !attrExceptions.includes(attr.name))))
		.map(({name, value}) => {
			if (name === 'class') {
				value = value
					.trim()
					.split(spaceRegExp)
					.filter((className) => !excludeClassRegExp.test(className))
					.sort()
					.join(' ');
			} else if (booleanAttributes.has(name)) {
				value = name;
			}
			return {name, value};
		})
		.sort(compareName);
	childNodes = cleanChildNodes(childNodes.map(filterHtmlStructure));
	return {
		tagName,
		attributes,
		childNodes,
	};
};

const hasNumberRegExp = /\d/;
export const idAttributes = new Set(['id', 'for', 'aria-labelledby', 'aria-describedby', 'aria-controls', 'aria-activedescendant', 'aria-owns']);
export const rewriteIds = (node: HTMLNode) => {
	let idCounter = 0;
	const createId = () => {
		idCounter++;
		return `rewritten-id-${idCounter}`;
	};
	const idsMap = new Map<string, string>();
	const getMappedId = (id: string) => {
		if (!hasNumberRegExp.test(id)) {
			return id; // don't replace ids that do not contain a number
		}
		let newId = idsMap.get(id);
		if (!newId) {
			newId = createId();
			idsMap.set(id, newId);
		}
		return newId;
	};

	const processAttribute = (attribute: HTMLAttribute): HTMLAttribute => {
		if (idAttributes.has(attribute.name)) {
			return {name: attribute.name, value: attribute.value.trim().split(/\s+/).map(getMappedId).join(' ')};
		}
		return attribute;
	};

	const processNode = (node: HTMLNode): HTMLNode => {
		if (node && typeof node === 'object') {
			const attributes = node.attributes.map(processAttribute);
			const childNodes = node.childNodes.map(processNode);
			return {
				...node,
				attributes,
				childNodes,
			};
		} else {
			return node;
		}
	};

	return processNode(node);
};

export const htmlSnapshot = async (locator: Locator) => {
	const res: string[] = [];
	const recFn = (node: HTMLNode, level = '') => {
		if (node && typeof node === 'object') {
			const {tagName, attributes, childNodes} = node;
			const hasAttributes = attributes.length > 0;
			const hasChildNodes = childNodes.length > 0;
			res.push(`${level}<${tagName}${hasAttributes ? '' : hasChildNodes ? '>' : ' />'}`);
			if (hasAttributes) {
				for (const {name, value} of attributes) {
					res.push(`${level} ${name}=${JSON.stringify(value)}`);
				}
				res.push(`${level}${hasChildNodes ? '>' : '/>'}`);
			}
			if (hasChildNodes) {
				for (const child of childNodes) {
					recFn(child, `${level}\t`);
				}
				res.push(`${level}</${tagName}>`);
			}
		} else {
			res.push(level + JSON.stringify(node));
		}
	};
	recFn(rewriteIds(filterHtmlStructure(await htmlStructure(locator))));
	return res.join(os.EOL);
};
