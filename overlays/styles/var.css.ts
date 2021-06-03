import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    black: '#000',
    white: '#fff',
    'orange-red': '#FC7753',
    orange: '#FFBE54',
    yellow: '#F6E036',
    green: '#D0D91F',
    teal: '#8CDCB6',
    blue: '#57D7DB',
    'dark-blue': '#47B8D1',
    purple: '#BB98B6',
  },
  fontFamily: {
    body:
      '"Unica One", sans-serif',
  },
});