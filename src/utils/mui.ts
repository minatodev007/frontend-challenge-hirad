import { PaletteMode } from '@mui/material'
import { grey } from '@mui/material/colors'

const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          // palette values for light mode
          primary: {
            main: '#00e676',
          },
          secondary: {
            main: '#1da056',
          },
          text: {
            primary: grey[900],
            secondary: grey[800],
          },
        }
      : {
          // palette values for dark mode
          primary: {
            main: '#00e676',
          },
          secondary: {
            main: '#1da056',
          },
          background: {
            default: '#141618',
          },
          text: {
            primary: '#fff',
            secondary: grey[500],
          },
        }),
  },
})

const putCommas = (number: number | string) => {
  if (typeof number === 'undefined') return number
  if (typeof number === 'number') number = number.toString()
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export { getDesignTokens, putCommas }
