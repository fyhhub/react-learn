import { createRoot } from 'react-dom/client'
let element = (
  <div>
    123 <span></span>
  </div>
)
console.log("%c Line:3 🍫 element", "color:#ed9ec7", element);

const root = createRoot(document.querySelector('#root'))

root.render(element)

