
export function shouldSetTextContent(type, props) {
  return typeof props.children === 'string' || typeof props.children === 'number'
}

export function createTextInstance(text) {
  return document.createTextNode(text)
}

export function createInstance(element) {
  return document.createElement(element)
}

export function appendInitialChild(parent, child) {
  parent.appendChild(child)
}