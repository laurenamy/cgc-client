import React from 'react'
import { Navbar, Container, Nav } from "react-bootstrap"
import { Routes, Route, Link } from 'react-router-dom'
import Home from '../../pages/Home/Home'
import CreateFundForm from '../../pages/CreateFundForm/CreateFundForm'
import { Button, Badge } from 'react-bootstrap'
import { useMetaMask } from "metamask-react"
import truncateEthAddress from 'truncate-eth-address'

function Header() {
  const { status, connect, account } = useMetaMask()
  return (
    <header>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">Chaotic Good Crowdfund</Navbar.Brand>
          <Nav.Link as={Link} to="/">Home</Nav.Link>
          <Nav.Link as={Link} to="/create-fund">Create Fund</Nav.Link>
          {status === "notConnected" && (
            <Button onClick={connect}>Connect to MetaMask</Button>
          )}
          {status === "connected" && (
            <Badge bg="primary">{truncateEthAddress(account)}</Badge>
          )}
        </Container>
      </Navbar>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/create-fund" element={<CreateFundForm />} />
      </Routes>
    </header>
  )
}

export default Header