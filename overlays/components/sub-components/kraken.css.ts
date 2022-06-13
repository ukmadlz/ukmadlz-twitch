import { style } from '@vanilla-extract/css'
import { vars } from '../../styles/var.css'

const containerSize = 200;

export const krakenCounterContainer = style({
    "color": vars.color.white,
    "width": containerSize + "px",
    "height": containerSize + "px",
    "position": "absolute",
    "left":  ((1920 - containerSize) / 2) + "px",
    "top": "20px",
    "textAlign": "center",
    "background": "rgba(0,0,0,0.5)",
})