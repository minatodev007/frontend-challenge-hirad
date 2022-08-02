import { useState, useEffect } from 'react'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import useDarkMode from 'use-dark-mode'
import clsx from 'clsx'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import Paper from '@mui/material/Paper'

import {
  Chains,
  connectWallet,
  getEthBalance,
  getTokenBalances,
  shortenAddress,
  subscribeToNetworkChange,
  subscribeToNetworkDisconnect,
  UserToken,
} from 'utils/wallet'
import { putCommas } from 'utils/mui'

import styles from './Wallet.module.scss'

interface UserWallet {
  account: string
  chainId: '0x1' | '0x3' | '0x4' | '0x5' | '0x2a' | '0x9b75'
}

const WhiteTextColorButton = styled(Button)(({ theme }) => ({
  color: '#fff',
  boxShadow: 'none',
  textTransform: 'initial',
}))

const NotConnectedWallet = ({
  connectWallet,
}: {
  connectWallet: () => void
}) => {
  const darkMode = useDarkMode()

  return (
    <>
      <img
        src="https://raw.githubusercontent.com/MetaMask/brand-resources/c3c894bb8c460a2e9f47c07f6ef32e234190a7aa/SVG/metamask-fox.svg"
        alt="Metamask"
        className={styles.metamaskLogo}
      />
      <svg
        width="300"
        height="50"
        viewBox="0 0 215 33"
        className={styles.logotype}
      >
        <path
          fill={darkMode.value ? '#fff' : '#161616'}
          d="M151.26 16.64c-.89-.58-1.86-1-2.78-1.52-.6-.33-1.24-.63-1.76-1.06-.88-.72-.7-2.15.22-2.77 1.33-.88 3.52-.39 3.76 1.41 0 .04.04.07.08.07h2c.05 0 .09-.04.07-.1a3.94 3.94 0 00-1.46-2.94 4.66 4.66 0 00-2.84-.97c-5.28 0-5.77 5.59-2.92 7.35.33.2 3.12 1.6 4.1 2.21 1 .61 1.3 1.73.88 2.6-.4.81-1.4 1.37-2.42 1.3-1.1-.06-1.96-.66-2.26-1.59-.05-.17-.08-.5-.08-.63a.09.09 0 00-.08-.08h-2.17c-.03 0-.07.04-.07.08 0 1.56.39 2.43 1.45 3.22 1 .75 2.1 1.07 3.22 1.07 2.97 0 4.5-1.68 4.8-3.41.28-1.7-.22-3.23-1.74-4.24zm-94.2-7.59h-2.02a.09.09 0 00-.07.05l-1.78 5.86a.08.08 0 01-.16 0L51.25 9.1c-.01-.04-.04-.05-.08-.05h-3.31c-.04 0-.08.04-.08.07v14.96c0 .04.04.08.08.08h2.17c.04 0 .08-.04.08-.08V12.7c0-.09.13-.1.15-.02l1.8 5.9.13.4c0 .05.03.06.07.06h1.67c.04 0 .06-.03.07-.05l.13-.42 1.8-5.9c.02-.08.15-.06.15.03v11.37c0 .04.04.08.08.08h2.17c.04 0 .08-.04.08-.08V9.12c0-.03-.04-.07-.08-.07h-1.27zm60.98 0a.09.09 0 00-.08.05l-1.78 5.86a.08.08 0 01-.16 0l-1.78-5.86c0-.04-.03-.05-.07-.05h-3.3c-.04 0-.08.04-.08.07v14.96c0 .04.04.08.08.08h2.17c.03 0 .07-.04.07-.08V12.7c0-.09.13-.1.16-.02l1.8 5.9.12.4c.02.05.04.06.08.06h1.66a.1.1 0 00.08-.05l.13-.42 1.8-5.9c.02-.08.15-.06.15.03v11.37c0 .04.04.08.08.08h2.17c.04 0 .08-.04.08-.08V9.12c0-.03-.04-.07-.08-.07h-3.3zm-27.99 0H79.8c-.03 0-.07.04-.07.07V11c0 .04.04.08.07.08h3.97v13c0 .05.04.09.07.09h2.17c.04 0 .08-.04.08-.08V11.07h3.96c.04 0 .08-.04.08-.08V9.12c0-.03-.02-.07-.08-.07zm12.8 15.11h1.98c.05 0 .09-.06.07-.1l-4.08-15.01c0-.04-.03-.06-.07-.06H97.9a.09.09 0 00-.07.06l-4.08 15c-.02.05.02.1.07.1h1.98c.04 0 .06-.02.08-.05l1.18-4.36c.01-.04.04-.05.08-.05h4.36c.04 0 .07.02.08.05l1.18 4.36c.02.03.06.06.08.06zm-5.18-6.61l1.58-5.85a.08.08 0 01.16 0l1.58 5.85c.02.05-.02.1-.07.1h-3.17c-.06 0-.1-.05-.08-.1zm38.85 6.61h1.98c.05 0 .09-.06.08-.1L134.5 9.04c-.02-.04-.04-.06-.08-.06h-2.83a.09.09 0 00-.08.06l-4.08 15c-.01.05.03.1.08.1h1.97c.04 0 .07-.02.08-.05l1.18-4.36c.02-.04.04-.05.08-.05h4.37c.03 0 .06.02.07.05l1.19 4.36c0 .03.04.06.07.06zm-5.18-6.61l1.59-5.85a.08.08 0 01.15 0l1.59 5.85c0 .05-.03.1-.08.1h-3.17c-.05 0-.1-.05-.08-.1zm-64.12 4.39V17.3c0-.04.03-.08.07-.08h5.78c.04 0 .08-.04.08-.07v-1.87a.09.09 0 00-.08-.08H67.3c-.04 0-.07-.04-.07-.08v-3.96c0-.04.03-.08.07-.08h6.58c.04 0 .08-.04.08-.08V9.14a.09.09 0 00-.08-.08h-8.9a.09.09 0 00-.08.08v14.94c0 .04.04.08.08.08h9.17c.04 0 .08-.04.08-.08V22.1a.09.09 0 00-.08-.08h-6.86c-.04-.01-.06-.04-.06-.09zm103.86 2.09l-7.5-7.74a.08.08 0 010-.1l6.75-7a.07.07 0 00-.06-.13h-2.76c-.03 0-.04.01-.05.03l-5.73 5.93a.08.08 0 01-.13-.05V9.14a.09.09 0 00-.08-.08h-2.17a.09.09 0 00-.08.08v14.95c0 .04.04.08.08.08h2.17c.04 0 .08-.04.08-.08v-6.58c0-.07.09-.1.13-.05l6.5 6.68a.1.1 0 00.04.03h2.77c.05-.01.1-.1.04-.14z"
        ></path>
      </svg>

      <WhiteTextColorButton
        variant="contained"
        color="secondary"
        onClick={connectWallet}
      >
        Connect Wallet
      </WhiteTextColorButton>
    </>
  )
}

const Token = ({ balance, logo, name, symbol }: UserToken) => {
  return (
    <div className={styles.token}>
      <div className={styles.info}>
        <img src={logo} alt={symbol} />
        <div className={styles.caption}>
          <Typography variant="caption" component="span" fontWeight="bold">
            {symbol}
          </Typography>
          <Typography variant="caption" component="span" color={'gray'}>
            {name}
          </Typography>
        </div>
      </div>
      <Typography variant="caption" component="span">
        {Number(balance).toFixed(4)}
      </Typography>
    </div>
  )
}

const ConnectedWallet = ({
  userWallet,
  userTokens,
  ethPrice,
  userEth,
}: {
  userWallet: UserWallet | null
  userEth: UserToken | null
  userTokens: UserToken[]
  ethPrice: number
}) => {
  if (!userWallet) return null

  // Only calculating ETH
  const totalBalance = userEth ? userEth.balance * ethPrice : 0

  return (
    <>
      <header>
        <div className={styles.network}>
          <Typography variant="caption" component="h4" fontWeight="bold">
            {Chains[userWallet.chainId] || 'Unknown Network'}
          </Typography>
        </div>
        <Typography
          variant="caption"
          component="span"
          className={styles.connectedText}
        >
          Connected
        </Typography>
      </header>
      <div className={styles.walletInfo}>
        <div className={styles.address}>
          <span className={styles.address}>
            {shortenAddress(userWallet.account)}
          </span>
          <div className={styles.addressActions}>
            <IconButton aria-label="Copy">
              <ContentCopyIcon />
            </IconButton>
          </div>
        </div>
        <div className={styles.balanceContainer}>
          <Typography variant="caption" component="span">
            Total Balance (Only ETH)
          </Typography>
          <Typography
            variant="h5"
            component="h3"
            className={styles.connectedText}
          >
            ${putCommas(totalBalance.toFixed(4))}
          </Typography>
        </div>

        <div className={styles.tokensList}>
          {userEth ? <Token {...userEth} /> : null}
          {userTokens.map((token) => (
            <Token key={token.symbol} {...token} />
          ))}
        </div>
      </div>
    </>
  )
}

const Wallet = () => {
  const [userWallet, setUserWallet] = useState<UserWallet | null>(null)
  const [userTokens, setUserTokens] = useState<UserToken[]>([])
  const [userEth, setUserEth] = useState<UserToken | null>(null)
  const [ethUsdPrice, setEthUsdPrice] = useState(1300)
  const isConnected = Boolean(userWallet)

  const resetUserWallet = () => {
    setUserWallet(null)
  }

  const handleNetworkChange = () => {
    subscribeToNetworkChange().then((chainId) => {
      setUserWallet((currentValue: any) => ({ ...currentValue, chainId }))
      updateWallet()

      // Recursively resubscribe
      handleNetworkChange()
    })
  }

  const updateWallet = (connectingWallet?: UserWallet) => {
    if (!userWallet && !connectingWallet) return

    const address = connectingWallet
      ? connectingWallet.account
      : userWallet?.account
    const chainId = connectingWallet
      ? connectingWallet.chainId
      : userWallet?.chainId

    if (!address || !chainId) return

    getTokenBalances(address, chainId).then(setUserTokens)
    getEthBalance(address)
      .then(({ ethBalance, ethPrice }) => {
        setEthUsdPrice(ethPrice)
        setUserEth({
          logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=022',
          balance: ethBalance,
          name: 'Ethereum',
          symbol: 'ETH',
        })
      })
      .catch((err) => false)
  }

  const handleWalletConnect = (connectingWallet: UserWallet) => {
    setUserWallet(connectingWallet)
    updateWallet(connectingWallet)
  }

  const requestWalletConnection = () => {
    connectWallet()
      .then((data: any) => {
        handleWalletConnect(data)
        handleNetworkChange()
      })
      .catch(() => {
        alert('Please install MetaMask')
      })
  }

  useEffect(() => {
    requestWalletConnection()
    subscribeToNetworkDisconnect().then(resetUserWallet)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <section className={styles.wrapper}>
      <div
        className={clsx(styles.container, {
          [styles.connected]: isConnected,
        })}
      >
        {isConnected ? (
          <Paper sx={{ width: '100%', padding: '1rem' }}>
            <ConnectedWallet
              userEth={userEth}
              ethPrice={ethUsdPrice}
              userTokens={userTokens}
              userWallet={userWallet}
            />
          </Paper>
        ) : (
          <NotConnectedWallet connectWallet={requestWalletConnection} />
        )}
      </div>
    </section>
  )
}

export default Wallet
