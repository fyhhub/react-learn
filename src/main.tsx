import { createRoot } from 'react-dom/client'
let element = (
  <div>
    123
  </div>
)

const root = createRoot(document.querySelector('#root'))
console.log("%c Line:9 🍔 root", "color:#465975", root);

root.render(element)

