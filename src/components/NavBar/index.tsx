import { useState } from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import IconButton from '@mui/material/IconButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import Button from '@mui/material/Button'
import useDarkMode from 'use-dark-mode'
import { useNavigate, useLocation } from 'react-router-dom'

import styles from './NavBar.module.scss'

type ITabs = 'home' | 'wallet'

const isChartPage = false

const NavBar = () => {
  const darkMode = useDarkMode()
  const navigate = useNavigate()
  const location = useLocation()
  const tabsData = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      isActive: location.pathname === '/',
    },
    {
      id: 'wallet',
      label: 'Wallet',
      path: '/wallet',
      isActive: location.pathname === '/wallet',
    },
  ] as const

  const [activeTab, setActiveTab] = useState<ITabs>(
    tabsData.find((item) => item.isActive === true)?.id || 'home'
  )

  return (
    <nav className={styles.wrapper}>
      <div className={styles.container}>
        {isChartPage ? (
          <div className={styles.backButtonContainer}>
            <Button startIcon={<ArrowBackIcon />}>Back</Button>
          </div>
        ) : (
          <div className={styles.tabsContainer}>
            <Tabs
              value={activeTab}
              onChange={(_, value: ITabs) => {
                setActiveTab(value)

                const newActiveTab = tabsData.find((item) => item.id === value)
                navigate(newActiveTab?.path || '/')
              }}
              aria-label="Navigation"
            >
              {tabsData.map((tab) => (
                <Tab key={tab.id} label={tab.label} value={tab.id} />
              ))}
            </Tabs>
          </div>
        )}

        <IconButton
          aria-label="theme"
          className={styles.themeIcon}
          onClick={() => darkMode.toggle()}
        >
          <WbSunnyIcon />
        </IconButton>
      </div>
    </nav>
  )
}

export default NavBar
