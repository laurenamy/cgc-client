import React, { useState } from 'react'
import CrowdFund from '../../abi/Crowdfund'
import Web3 from 'web3'
import { Button, Alert, Container } from 'react-bootstrap'
import { CHARITIES, DAPP_CONTRACT } from '../../constants/constants'
import styles from './CreateFundForm.module.css'
import DatePicker from 'react-datepicker'
import { useMetaMask } from "metamask-react"
import { useNavigate } from 'react-router-dom'
import Loader from 'react-loader-spinner'

const CreateFundForm = () => {
  const web3 = new Web3(Web3.givenProvider)
  const { account } = useMetaMask()
  const navigate = useNavigate()
  const CrowdFundContract = new web3.eth.Contract(CrowdFund.abi, DAPP_CONTRACT)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [end, setEnd] = useState(new Date().setDate(new Date().getDate() + 7))
  const [target, setTarget] = useState(.001)
  const [donationRecipient, setDonationReceipient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onSubmit = async event => {
    event.preventDefault()
    setLoading(true)

    try {
      const args = [
        title,
        description,
        web3.utils.toBN(end),
        web3.utils.toWei(String(target)),
        donationRecipient
      ]

      const tx = await CrowdFundContract.methods.createFund(...args).send({
        from: account
      })
      console.log('Transaction submitted: ', tx)

      if (tx.events.FundCreated) {
        setSuccess('Your fund has been created!')
        navigate('/')
      } else {
        setError('Transaction failed. Try again later.')
      }
      setLoading(false)
    } catch (error) {
      console.log({error})
      setError('Transaction failed. Try again later.')
      setLoading(false)
    }
  }

  return (
    <div className={styles.form}>
      <Container>
        <h1>Create a CrowdFund</h1>
        {error && (
          <Alert variant='danger'>
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant='success'>
            {success}
          </Alert>
        )}
        <DatePicker
          selected={end}
          onChange={(date) => setEnd(date.getTime())} 
          minDate={new Date().setDate(new Date().getDate() + 7)}
        />
        <form onSubmit={onSubmit}>
          <label>
            Title:
            <br />
            <input 
              type="text"
              name="title"
              value={title}
              onChange={e => setTitle(e.target.value) }
              required
            />
          </label>
          <br />
          <label>
            Description:
            <br />
            <textarea 
              type="text"
              name="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
            />
          </label>
          <br />
          <label>
            Target (in eth):
            <br />
            <input 
              type="number"
              name="target"
              min=".001"
              step=".0001"
              value={target}
              onChange={e => setTarget(e.target.value)}
              required
            />
          </label>
          <br />
          {CHARITIES.length && (
            CHARITIES.map(charity => {
              return (
                <div className={styles.radio}>
                  <input
                    type="radio" 
                    value={charity.name} 
                    name="charity"
                    key={charity.name}
                    onChange={e => setDonationReceipient(charity.address)}
                    required
                  />
                  <span className={styles.radioLabel}>{charity.name}</span>
                </div>
              )
            })
          )}
          <br />
          <Button type="submit" value="Create" >Create</Button>
          {loading && (
            <Loader type="Audio" height="20" width="20" color="#1976D2" />
          )}
        </form>
        <br/>
      </Container>
    </div>  
  )
}

export default CreateFundForm