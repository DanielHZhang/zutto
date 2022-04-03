import {Node, parse} from 'svg-parser';

const kebobRegex = /(-|:)./g;
let ignoredAttributes: Set<string> | undefined;

function kebobToCamelcase(str: string): string {
  return str.replace(kebobRegex, (x) => x[1].toUpperCase());
}

/** @internal */
export function setIgnoredAttributes(list: string[]): void {
  ignoredAttributes = new Set(list);
}

/** @internal */
export function parseProperties(props?: Record<string, string | number>): string {
  if (!props) {
    return '';
  }
  return Object.keys(props).reduce((result, key) => {
    if (ignoredAttributes?.has(key)) {
      return result;
    }
    const operator = typeof props[key] === 'number' ? '{}' : '""';
    const newKey = key.startsWith('aria') ? key : kebobToCamelcase(key);
    return `${result} ${newKey}=${operator[0]}${props[key]}${operator[1]}`;
  }, '');
}

/** @internal */
export function parseNode(node: Node): string {
  if (node.type === 'text') {
    return node.value ? node.value.toString() : '';
  }
  // Node type is 'element'
  let result = `<${node.tagName}${parseProperties(node.properties)}>`; // Opening tag
  node.children.forEach((child) => {
    if (typeof child === 'string') {
      result += `{\`${child}\`}`;
    } else {
      const children = parseNode(child);
      if (children.startsWith('<')) {
        result += children; // Child node is also an element -> directly append
      } else {
        result += `{\`${children}\`}`; // Child node is text -> must wrap in JSX braces {}
      }
    }
  });
  result += `</${node.tagName}>`;
  return result;
}

/**
 * Transforms an HTML svg string into a string representation of a solid-js svg component.
 * @internal
 */
export function svgToSolidComponent(source: string): string {
  const root = parse(source);
  if (
    root.children.length < 1 ||
    root.children[0].type !== 'element' ||
    root.children[0].tagName !== 'svg'
  ) {
    throw new Error('Invalid SVG root node');
  }
  let svg = parseNode(root.children[0]);
  let endTagIndex = svg.indexOf('>');
  if (svg.charAt(endTagIndex - 1) === '/') {
    endTagIndex -= 1; // Get position before `/>` instead of `>`
  }
  svg = `${svg.slice(0, endTagIndex)} {...props}${svg.slice(endTagIndex)}`;
  return `export default function Svg(props){return(${svg});}`;
}
