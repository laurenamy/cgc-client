import React, { useEffect, useState } from 'react'
import CrowdFund from '../../abi/Crowdfund'
import Web3 from 'web3'
import { Card, ListGroup, ListGroupItem, Col, Badge, Button, Alert } from 'react-bootstrap'
import truncateEthAddress from 'truncate-eth-address'
import { useMetaMask } from 'metamask-react'
import Loader from 'react-loader-spinner'
import styles from './FundCard.module.css'
import { DAPP_CONTRACT } from '../../constants/constants'

const getDateString = (timestamp) => {
  const date = new Date(timestamp)
  return `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`
}

const FundCard = ({fund}) => {
  const web3 = new Web3(Web3.givenProvider)
  const CrowdFundContract = new web3.eth.Contract(CrowdFund.abi, DAPP_CONTRACT)
  const { account } = useMetaMask()
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [contribution, setContribution] = useState(.0001)
  const [loading, setLoading] = useState(false)
  const [currentContribution, setCurrentContribution] = useState('')
  const [active, setActive] = useState(true)

  const getContribution = async () => {
    const res = await CrowdFundContract.methods.checkFunding(+fund.id).call()
    setCurrentContribution(web3.utils.fromWei(res, 'ether'))
    if (+currentContribution > +web3.utils.fromWei(fund.target, 'ether')) setActive(false)
  }

  useEffect(() => {
    getContribution()
  })

  const contribute = async (fundId, contribution) => {
    try {
      setLoading(true)
      const tx = await CrowdFundContract.methods.contribute(web3.utils.toBN(fundId)).send({
        from: account,
        value: web3.utils.toWei(String(contribution))
      })
      console.log('Transaction submitted: ', tx)
      if (tx.events.DonationReceived) {
        setSuccess('You successfully contributed to this fund.')
      } else {
        setError('Transaction failed. Try again later.')
      }
      setLoading(false)
    } catch (error) {
      setError(JSON.stringify(error))
      console.log({error})
      setLoading(false)
    }
  }

  return (
    <Col>
      <Card className={styles.fundCard} key={+fund.id}>
        <Card.Header as="h5"><Badge className={styles.activeBadge} bg={active ? "success" : "secondary"}>{active ? "Active" : "Closed"}</Badge>{fund.title}</Card.Header>
        <Card.Title className={styles.cardTitle}>{fund.description}</Card.Title>
        <Card.Body>
          {loading && (
            <Loader type="Audio" height="20" width="20" color="#1976D2" />
          )}
          {active && (
            <>
              <input 
                type="number"
                name="contribution"
                min=".0001"
                step=".0001"
                value={contribution}
                onChange={e => setContribution(e.target.value)}
                required
              />
              <Button type="primary" onClick={() => contribute(+fund.id, contribution)}>Contribute</Button>
              {error && (
                <Alert variant='danger'>
                  Oops, something happened.
                </Alert>
              )}
              {success && (
                <Alert variant='success'>
                  {success}
                </Alert>
              )}
            </>
          )}
        </Card.Body>
        <ListGroup className="list-group-flush">
          <ListGroupItem>Target date: {getDateString(+fund.end)}</ListGroupItem>
          <ListGroupItem>Current funding: {currentContribution} ETH</ListGroupItem>
          <ListGroupItem>Funding goal: {web3.utils.fromWei(fund.target, 'ether')} ETH</ListGroupItem>
        </ListGroup>
        <Card.Footer>
          Created by: <Badge bg="primary">{truncateEthAddress(fund.owner)}</Badge>
        </Card.Footer>
      </Card>
    </Col>
  )
}

export default FundCard