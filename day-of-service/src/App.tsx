import { useState } from 'react'
import * as React from 'react'
import hseLogo from "./assets/hseLogo.png"
import { Input, InputGroup, Kbd, Image, Text, Container, SegmentGroup } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import './App.css'
import data from "./data.json"

function App() {
  
  const [value, setValue] = useState<string | null>("Any")

  return (
    <>
    <Container style={{ flexDirection: 'row', padding: 30, alignItems: 'center', marginBottom: '20px',  display: 'flex', height: '80px' }}>
    <Image rounded="md" style={{ width: '100px' }} src={hseLogo} alt="HSE Logo" />
    <Text style={{ flex: 1 }} >HSE Day of Service App</Text>
    </Container>
    {/* <Text>Day of service is a day, where instead of doing service, students across hse schools participate in leisurely activities within HSE, also check out LinkHands and Community AI App (Yet to be named)</Text> */}
    <Text> Description</Text>
      <InputGroup flex="1" startElement={<LuSearch />} >
        <Input placeholder="Search contacts" />
      </InputGroup>
      <SegmentGroup.Root value={value} onValueChange={(e) => setValue(e.value)}>
      <SegmentGroup.Indicator />
      <SegmentGroup.Items items={["Any", "1", "2", "3", "5", "6", "7"]} />
    </SegmentGroup.Root>
    
    </>
  )
}

export default App
