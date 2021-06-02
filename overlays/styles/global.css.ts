import { globalStyle } from '@vanilla-extract/css';
import { vars } from './var.css';

globalStyle('*', {
  "boxSizing": "border-box",
})
globalStyle('body', {
  "all": "unset",
  "height": "1080px",
  "width": "1920px",
})
globalStyle('main', {
  "minHeight": "900px",
});
globalStyle('footer', {
  "minHeight": "180px"
});
