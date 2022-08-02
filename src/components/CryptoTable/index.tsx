import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { CRYPTOCURRENCIES } from 'db'

import styles from './CryptoTable.module.scss'
import { putCommas } from 'utils/mui'

const HeadingData = [
  'Coin',
  'Symbol',
  'Price',
  '24h Volume',
  'Mkt Cap',
  'Last 7 days',
] as const

const CryptoTable = () => {
  return (
    <TableContainer
      component={(props) => <Paper {...props} variant="outlined" />}
    >
      <Table aria-label="Cryptocurrencies">
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            {HeadingData.map((item) => (
              <TableCell key={item}>{item === 'Symbol' ? '' : item}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {CRYPTOCURRENCIES.map((item, index) => (
            <TableRow
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell style={{ fontWeight: 'bold' }}>{index + 1}</TableCell>
              <TableCell component="th" scope="row">
                <div className={styles.coinCellContainer}>
                  <img src={item.logo} alt={item.symbol} />
                  <Typography
                    variant="caption"
                    component="span"
                    fontWeight="bold"
                  >
                    {item.label}
                  </Typography>
                </div>
              </TableCell>
              <TableCell>
                <Typography variant="caption" component="span" marginRight={5}>
                  {item.symbol}
                </Typography>
              </TableCell>
              <TableCell>${putCommas(item.price)}</TableCell>
              <TableCell>${putCommas(item.volume)}</TableCell>
              <TableCell>${putCommas(item.marketCap)}</TableCell>
              <TableCell>$125B Volume</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default CryptoTable
