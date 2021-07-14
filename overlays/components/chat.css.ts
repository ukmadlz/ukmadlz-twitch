import { style } from '@vanilla-extract/css'
import { vars } from '../styles/var.css'

export const chatContainer = style({
    overflow: "hidden",
})
export const chatList = style({
    maxHeight: "650px",
    width: "350px",
    display: "flex",
    flexDirection: "column",
    background: "gray",
})
export const chatMessage = style({
    background: vars.color.black,
    color: vars.color.white,
})
export const profileImage = style({
    width: "5em",
    float: "left",
})
export const textContainer = style({
    display: "inline",
    float: "left",
})
export const userName = style({
    display: "block",
    padding: "0.25em"
})
export const message = style({
    display: "block",
    width: "250px",
    padding: "0.5em"
})