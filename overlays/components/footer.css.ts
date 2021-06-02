import { style } from '@vanilla-extract/css'
import { vars } from '../styles/var.css'

export const footer = style({
    "background": vars.color.black,
})
export const colourBar = style({
    "height": "1em",
    "width": "100%",
    "backgroundColor": vars.color.yellow
})
export const footerContainer = style({
    "padding": "1em",
})
export const logoContainer = style({
})