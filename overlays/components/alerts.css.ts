import { style } from '@vanilla-extract/css'
import { vars } from '../styles/var.css'

export const alertContainer = style({
    color: vars.color.white,
    width: (1920 / 3) + 'px',
    height: (1080 / 3) + 'px',
    position: 'absolute',
    top: (1080 / 3) + 'px',
    left: (1920 / 3) + 'px',
    background: 'rgba(0,0,0,0.5)',
})

export const alertGifs = style({
    width: (1920 / 3) + 'px',
});

export const invisble = style({
    display: 'none',
})