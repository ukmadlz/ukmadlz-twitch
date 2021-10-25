import { style } from '@vanilla-extract/css'
import { vars } from '../../styles/var.css'

export const embarrassedContainer = style({
    width: (1920 / 3) + 'px',
    height: (1080 / 3) + 'px',
    position: 'absolute',
    top: (1080 / 3) + 'px',
    left: (1920 / 3) + 'px',
})