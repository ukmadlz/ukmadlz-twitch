import { createGlobalTheme } from '@vanilla-extract/css';

export const vars = createGlobalTheme(':root', {
  color: {
    black: '#000',
    white: '#fff',
    'orange-red': '#D0D91F',
    orange: '#FC7753',
    yellow: '#57D7DB',
    green: '#BB98B6',
    teal: '#F6E036',
    blue: '47B8D1',
    'dark-blue': '#FFBE54',
    purple: '#8CDCB6',
  },
  fontFamily: {
    body:
      '"Unica One", sans-serif',
  },
});