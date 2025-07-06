import { Node } from "@motion-canvas/2d";
export function findFirstNodeOfType<T extends Node>(node: Node, classType: new (...args: any[]) => T): T | null {
    // 1. Check if the current node is of the desired type
    if (node instanceof classType) {
      return node as T; // Found it! Return the node.
    }
  
    // 2. If not, iterate through its children
    for (const child of node.children()) {
      // 3. Recursively call the function on each child
      const found = findFirstNodeOfType(child, classType);
      if (found) {
        return found; // If a child's subtree found it, propagate it up.
      }
    }
  }
  
  export function findAllNodesOfType<T extends Node>(node: Node, classType: new (...args: any[]) => T): T[] {
    const foundNodes: T[] = [];
  
    // 1. Check if the current node is of the desired type and add it
    if (node instanceof classType) {
      foundNodes.push(node as T);
    }
  
    // 2. Iterate through its children
    for (const child of node.children()) {
      // 3. Recursively call the function on each child
      // and concatenate the results from the child's subtree
      foundNodes.push(...findAllNodesOfType(child, classType));
    }
  
    // 4. Return the accumulated list of found nodes
    return foundNodes;
  }
  
  // function fillSVG(svg_obj : SVG, colour = "white"){
  //   const svgWrapper :Node= svgRef().children()[0];
  //   const pathAnimations = [];
  //   for (const child of svgWrapper.children()) {
  //     if (child instanceof Path) {
  //       console.log(`Found a Path: ${child.constructor.name}`);
  //       // Push the ThreadGenerator directly into the array
  //       pathAnimations.push(child.fill('white', 1));
  //     }
  //   }
  
  // }
  
  export function printNodeTree(node: Node, prefix: string = '', isLast: boolean = true): string {
    let treeString = '';
    const nodeName = node.constructor.name; // Get the class name of the node (e.g., "Node", "Path", "Rect", "SVG")
    const nodeId = node.key ? ` (Key: ${node.key})` : ''; // Add ID if available
  
    // Determine the current line's connector
    const connector = isLast ? '└── ' : '├── ';
  
    // Add the current node to the tree string
    treeString += `${prefix}${connector}${nodeName}${nodeId}\n`;
  
    // Prepare the prefix for children
    const childPrefix = prefix + (isLast ? '    ' : '│   ');
  
    // Get children and iterate
    const children = node.children();
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const childIsLast = (i === children.length - 1);
      treeString += printNodeTree(child, childPrefix, childIsLast);
    }
  
    return treeString;
  }
  
  export function* recurseNodes(node: Node): Generator<Node> {
    // Yield the current node first
    yield node;
  
    // Then, iterate over its children and recursively call recurseNodes
    // node.children() returns a NodeList, which is iterable.
    for (let child of node.children()) {
      // Check if the child is an instance of Node before recursing
      if (child instanceof Node) {
        // Use 'yield*' to delegate to the sub-generator, effectively flattening the results.
        yield* recurseNodes(child);
      }
    }
  }
  