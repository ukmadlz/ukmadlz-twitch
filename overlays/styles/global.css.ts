import { globalStyle } from '@vanilla-extract/css';
import { vars } from './var.css';

globalStyle('*', {
  "boxSizing": "border-box"
})
globalStyle('body', {
  "all": "unset",
  "height": "1080px",
  "width": "1920px",
  "fontFamily": vars.fontFamily.body,
})
globalStyle('main', {
  "minHeight": "940px",
});
globalStyle('footer', {
  "minHeight": "140px"
});
