/* eslint-disable no-loop-func */
import Web3 from 'web3'
import { ethers } from 'ethers'

declare global {
  interface Window {
    ethereum: any
  }
}

enum Chains {
  '0x1' = 'Ethereum Main Network',
  '0x3' = 'Ropsten Test Network',
  '0x4' = 'Rinkeby Test Network',
  '0x5' = 'Goerli Test Network',
  '0x2a' = 'Kovan Test Network',
  '0x9b75' = 'Energi Network',
  '0xc285' = 'Energi Test Network',
}

export interface UserToken {
  logo: string
  name: string
  symbol: string
  balance: number
}

const zeroBalanceToken =
  '0x0000000000000000000000000000000000000000000000000000000000000000'

const commonAlchemyRawBody = {
  jsonrpc: '2.0',
  headers: {
    'Content-Type': 'application/json',
  },
  id: 42,
}

const alchemyApiKey = 'wkgKdRChYJAIfgwXqpf2XxNbXiKhYIXA'

const web3ProviderUrl = `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`

const alchemyFetchURL = `https://eth-mainnet.g.alchemy.com/v2/${alchemyApiKey}`

const web3 = new Web3(web3ProviderUrl)
const ethersProvider = new ethers.providers.AlchemyProvider(
  'homestead',
  alchemyApiKey
)

const connectWallet = () => {
  return new Promise(async (resolve, reject) => {
    // Check if MetaMask is installed on user's browser
    if (window.ethereum) {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      })
      const chainId = await window.ethereum.request({ method: 'eth_chainId' })

      if (accounts.length > 0) {
        const walletData = {
          account: accounts[0],
          chainId,
        }
        resolve(walletData)
        return
      }
    } else {
      reject()
    }
  })
}

const subscribeToNetworkDisconnect = () => {
  return new Promise<void>((resolve, reject) => {
    try {
      window.ethereum.on('accountsChanged', (accounts: any[]) => {
        if (accounts.length === 0) {
          resolve()
        }
      })
    } catch (err) {
      reject()
    }
  })
}

const subscribeToNetworkChange = () => {
  return new Promise<keyof typeof Chains>((resolve, reject) => {
    try {
      window.ethereum.on('chainChanged', (networkId: keyof typeof Chains) => {
        const networkHex = web3.utils.toHex(networkId) as keyof typeof Chains
        resolve(networkHex)
      })
    } catch (err) {
      reject()
    }
  })
}

const getTokenMetadata = (contractAddress: string, tokenBalance: string) => {
  return new Promise<UserToken>((resolve, reject) => {
    const metadataRaw = JSON.stringify({
      ...commonAlchemyRawBody,
      method: 'alchemy_getTokenMetadata',
      params: [contractAddress],
    })

    let balance: any = Number(web3.utils.hexToNumberString(tokenBalance))

    // Get metadata of token
    fetch(alchemyFetchURL, {
      method: 'POST',
      body: metadataRaw,
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then(({ result: metadata }: any) => {
        // Compute token balance in human-readable format
        balance = balance / Math.pow(10, metadata['decimals'])
        balance = balance.toFixed(2)

        const tokenMetadata: UserToken = {
          logo: metadata.logo,
          name: metadata.name,
          symbol: metadata.symbol,
          balance,
        }

        resolve(tokenMetadata)
      })
      .catch((err) => {
        reject()
      })
  })
}

const getEthBalance = (address: string) => {
  return new Promise<{ ethPrice: number; ethBalance: number }>(
    async (resolve, reject) => {
      // Query the blockchain
      try {
        const ethBalance = await ethersProvider.getBalance(address, 'latest')
        let ethPrice = 1300

        fetch(
          'https://api.etherscan.io/api?module=stats&action=ethprice&apikey='
        )
          .then((response) => response.json())
          .then(({ result }) => {
            if (result.ethusd) {
              ethPrice = Number(result.ethusd)
            }
          })
          .catch(() => false)

        resolve({
          ethPrice,
          ethBalance: Number(ethers.utils.formatEther(ethBalance)),
        })
      } catch (err) {
        reject(err)
      }
    }
  )
}

const getTokenBalances = (address: string, chainId: keyof typeof Chains) => {
  return new Promise<UserToken[]>((resolve, reject) => {
    try {
      const tokenBalancesAPI = JSON.stringify({
        ...commonAlchemyRawBody,
        method: 'alchemy_getTokenBalances',
        params: [address, `DEFAULT_TOKENS`],
      })

      const userTokens: UserToken[] = []

      fetch(alchemyFetchURL, {
        method: 'POST',
        body: tokenBalancesAPI,
        redirect: 'follow',
      })
        .then((response) => response.json())
        .then(async (response) => {
          // Get balances
          const balances = response['result']

          // Remove tokens with zero balance
          const nonZeroBalances = balances['tokenBalances'].filter(
            (token: any) => {
              return token['tokenBalance'] !== zeroBalanceToken
            }
          )

          // Loop through all tokens with non-zero balance
          for (const token of nonZeroBalances) {
            // Get balance of token
            const balance = token['tokenBalance']

            const tokenMetaData = await getTokenMetadata(
              token.contractAddress,
              balance
            )
            userTokens.push(tokenMetaData)
          }
          resolve(userTokens)
        })
    } catch (err) {
      reject(err)
    }
  })
}

const shortenAddress = (address: string, chars = 4): string => {
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
}

export {
  connectWallet,
  shortenAddress,
  subscribeToNetworkChange,
  Chains,
  subscribeToNetworkDisconnect,
  getTokenBalances,
  getEthBalance,
}
