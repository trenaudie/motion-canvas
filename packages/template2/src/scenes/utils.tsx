import { Node, SVG } from "@motion-canvas/2d";

export function logMethods(obj:Node, levels = 3) {
    let proto = obj;
    for (let i = 0; i < levels; i++) {
      proto = Object.getPrototypeOf(proto);
      if (!proto) break;
      const methods = Object.getOwnPropertyNames(proto)
        .filter(name => typeof obj[name as keyof Node] === 'function');
      console.log(`Prototype level ${i + 1} (${proto.constructor.name}):`, methods);
    }
}


export function recurse_parent_with_width_height(node: Node){
  if (!node) return;
  const proto = Object.getPrototypeOf(node);
  if (!proto) return;
  const methods = Object.getOwnPropertyNames(proto)
  .filter(name => typeof node[name as keyof Node] === 'function');
  if (methods.includes('width') && methods.includes('height') ){
    console.log('found width and height for constructor name', node.constructor.name)
    return node;
  }
  return recurse_parent_with_width_height(node.parent());
}


// export async function loadSVG(path: string): Promise<string | null> {
//   try {
//     const res = await fetch(path);
//     if (!res.ok) {
//       console.error(`❌ Failed to fetch SVG from ${path}: ${res.statusText}`);
//       return null;
//     }

//     const svgString = await res.text();

//     return svgString
//   } catch (error) {
//     console.error(`❌ Error loading SVG from ${path}:`, error);
//     return null;
//   }
// }