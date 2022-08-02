import CryptoTable from 'components/CryptoTable'

import styles from './Home.module.scss'

const Home = () => {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <CryptoTable />
      </div>
    </section>
  )
}

export default Home
