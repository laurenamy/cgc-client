import React from 'react'
import { Card, Button } from 'react-bootstrap'
import styles from './Hero.module.css'

const Hero = () => {
  return (
    <Card bg="primary" className={styles.hero}>
      <Card.Body>
        <h1 className={styles.title}>Raise funds, do good.</h1>
        <h4 className={styles.tagline}>Do some good in the world by automatically donating to a charity of your choice when you raise funds, 
        even if your goal isn't met.</h4>
        <Button className={styles.heroButton} variant="light" href="/create-fund">Start a fund</Button>
      </Card.Body>
    </Card>
  )
}

export default Hero