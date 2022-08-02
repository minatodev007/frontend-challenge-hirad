import { useMemo } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import useDarkMode from 'use-dark-mode'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { getDesignTokens } from 'utils/mui'
import NavBar from 'components/NavBar'
import Home from 'pages/Home'
import Wallet from 'pages/Wallet'

function App() {
  const darkMode = useDarkMode()
  // Update the theme only if the mode changes
  const theme = useMemo(
    () => createTheme(getDesignTokens(darkMode.value ? 'dark' : 'light')),
    [darkMode.value]
  )

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <NavBar />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/wallet" element={<Wallet />} />
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
