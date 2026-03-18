import { useState } from 'react'
import * as React from 'react'
import { Input, InputGroup, Kbd, Image } from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import './App.css'
import data from "./data.json"

function App() {
 console.log(data);

  return (
    <>
    <Image rounded="md" src="" alt="HSE Logo" />
      <InputGroup flex="1" startElement={<LuSearch />} endElement={<Kbd>⌘K</Kbd>}>
        <Input placeholder="Search contacts" />
      </InputGroup>
    </>
  )
}

export default App
