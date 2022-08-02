import btcLogo from 'assets/images/Bitcoin.svg'
import ethLogo from 'assets/images/Ethereum.svg'
import tetherLogo from 'assets/images/Tether.svg'
import dogeLogo from 'assets/images/Dogecoin.svg'
import solLogo from 'assets/images/Solana.svg'
import xmrLogo from 'assets/images/Monero.svg'
import trxLogo from 'assets/images/Tron.svg'

interface CryptoCurrency {
  id: string
  label: string
  symbol: string
  logo: string
  price: number
  volume: number
  marketCap: number
}

const CRYPTOCURRENCIES: CryptoCurrency[] = [
  {
    id: 'bitcoin',
    label: 'Bitcoin',
    symbol: 'BTC',
    logo: btcLogo,
    price: 20788,
    volume: 37757396368,
    marketCap: 396941040572,
  },
  {
    id: 'ethereum',
    label: 'Ethereum',
    symbol: 'ETH',
    logo: ethLogo,
    price: 1221.85,
    volume: 16353740948,
    marketCap: 148520860008,
  },
  {
    id: 'tether',
    label: 'Tether',
    symbol: 'USDT',
    logo: tetherLogo,
    price: 1,
    volume: 44664270202,
    marketCap: 65851143963,
  },
  {
    id: 'doge',
    label: 'Doge',
    symbol: 'DOGE',
    logo: dogeLogo,
    price: 0.06269,
    volume: 374769815,
    marketCap: 8300166651,
  },
  {
    id: 'solana',
    label: 'Solana',
    symbol: 'SOL',
    logo: solLogo,
    price: 37.3,
    volume: 1227110689,
    marketCap: 12840216945,
  },
  {
    id: 'tron',
    label: 'Tron',
    symbol: 'TRX',
    logo: trxLogo,
    price: 0.067,
    volume: 483594177,
    marketCap: 6186840260,
  },
  {
    id: 'monero',
    label: 'Monero',
    symbol: 'XMR',
    logo: xmrLogo,
    price: 135.42,
    volume: 87431445,
    marketCap: 2457543405,
  },
]

export { CRYPTOCURRENCIES }
