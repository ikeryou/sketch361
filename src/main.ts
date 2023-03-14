import './style.css'
import { Contents } from './parts/contents';

document.querySelectorAll('.js-text').forEach((val) => {
  new Contents({
    el:val,
  })
})

