import { useMemo, useState } from "react"
import hseLogo from "./assets/hseLogo.png"
import {
  Box,
  Container,
  Image,
  Input,
  InputGroup,
  SegmentGroup,
  Text,
  ScrollArea,
  Stack,
  Dialog,
  Portal,
  CloseButton,
} from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import "./App.css"
import data from "./data.json"

type DataItem = {
  Title: string
  Teacher: string
  Period: string
  Location: string
  "Age Group": string
  Description?: string
  Other?: string 
}
// `data.json` is an array of objects with lowercase keys (title, teacher, period, etc.).
// Map it to the `DataItem` shape the UI expects and normalize `period` to a string.
type RawItem = {
  session_id: string
  teacher: string
  other_instructors: string | null
  period: number | string
  title: string
  location: string
  age_group: string
  max_students?: string
  description?: string
}

const rawRecords = data as RawItem[]
const records: DataItem[] = rawRecords.map((d) => ({
  Title: d.title,
  Teacher: d.teacher,
  Period: String(d.period),
  Location: d.location,
  "Age Group": d.age_group,
  Description: d.description,
  Other: d.other_instructors || "None",
}))
const periodOptions = [ ...Array.from(new Set(records.map((r) => r.Period)))]
const ageGroupOptions = [
  "Any",
  ...Array.from(new Set(records.map((r) => r["Age Group"]))),
]

function App() {
  const [query, setQuery] = useState("")
  const [descriptionVisible, setDescriptionVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)
  const [period, setPeriod] = useState("1")
  const [ageGroup, setAgeGroup] = useState("hs")

  const selectItem = (item: DataItem) => {
    setSelectedItem(item)
    setDescriptionVisible(true)
  }
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()

    return records.filter((item) => {
      const matchesPeriod = period === "Any" || item.Period === period
      if (!matchesPeriod) return false

      const matchesAgeGroup = ageGroup === "Any" || item["Age Group"] === ageGroup
      if (!matchesAgeGroup) return false

      if (!q) return true
      return (
        item.Title.toLowerCase().includes(q) ||
        item.Teacher.toLowerCase().includes(q) ||
        item.Location.toLowerCase().includes(q) ||
        item.Period.toLowerCase().includes(q) ||
        item["Age Group"].toLowerCase().includes(q)
      )
    })
  }, [query, period, ageGroup])

  return (
    <>
      <Container
        style={{
          flexDirection: "row",
          padding: 30,
          alignItems: "center",
          marginBottom: "20px",
          display: "flex",
          height: "80px",
        }}
      >
        <Image rounded="md" style={{ width: "100px" }} src={hseLogo} alt="HSE Logo" />
        <Text style={{ flex: 1 }}>HSE Day of Service App</Text>
      </Container>

      <Text mb="2">High School Day of Service Opportunities</Text>
      <Container style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        <Box mt="4" style={{width: "40%"}}>
          <Text mb="2">Filter by key words.</Text> 
      <InputGroup flex="1" style={{width: "80%"}}startElement={<LuSearch />}>
        <Input
          placeholder="Search by title, teacher, or location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>
      </Box>

      <Box mt="4" style={{width: "40%", right: "100%"}}>
        <Text mb="2">Filter by Period</Text>
        <SegmentGroup.Root
          defaultValue={"1"}
          value={period}
          onValueChange={(e) => e.value && setPeriod(e.value)}
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items items={periodOptions} />
        </SegmentGroup.Root>
      </Box>
      </Container>

      {/* <Box mt="4">
        <Text mb="2">Filter by Age Group</Text>
        <SegmentGroup.Root
          defaultValue={"Any"}
          value={ageGroup}
          onValueChange={(e) => e.value && setAgeGroup(e.value)}
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items items={ageGroupOptions} />
        </SegmentGroup.Root>
      </Box> */}

      <Box mt="6">
        <Text mb="3">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </Text>
   <ScrollArea.Root height="400px" style={{marginTop: 10, padding: 10, marginBottom: 20}}>
            <ScrollArea.Viewport>
              <ScrollArea.Content>
        <Stack
      style={{
        
      }}
    >
        {filtered.length === 0 ? (
          <Text color="gray.500">No matching entries.</Text>
        ) : (
          filtered.map((item, index) => (
                <Box style={{ display: "flex", backgroundColor: "white", color: "black", borderRadius: "8px", justifyContent: "space-between", padding: "10px"}}
                  onClick={() => {selectItem(item)}}
            _hover={{
            bg: "#828282ff",
            cursor: "pointer",
                 }}>
                <Text>Period {item.Period}</Text>
                <Text>{item.Title}</Text>
                <Text>{item.Teacher}</Text>
                </Box>
          ))
        )}
        </Stack>
        </ScrollArea.Content>
    </ScrollArea.Viewport>
     <ScrollArea.Scrollbar />
          </ScrollArea.Root>
      </Box>
      <Dialog.Root open={descriptionVisible}
      placement={"center"} 
      onInteractOutside={() => {setDescriptionVisible(false)}}
      onEscapeKeyDown={()=> {setDescriptionVisible(false)}}
      size={"lg"}
      >
      <Portal>
        <Dialog.Positioner>
          <Dialog.Backdrop />
          <Dialog.Content >
            <Dialog.Header>
              <Dialog.Title>{selectedItem?.Title}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>
              {selectedItem && (
                <>
                <Text fontSize={20} marginBottom={10}>No description Available.</Text>
                <Text marginBottom={1}>Host's Name: {selectedItem.Teacher}</Text>
                <Text marginBottom={1}>Department: {null}</Text>
                <Text marginBottom={2}>Location: {selectedItem.Location}</Text>
                <Text>Other Teacher's Involved: {selectedItem.Other}</Text>
                </>
              )}
            </Dialog.Body>
            <Dialog.Footer>
            </Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" onClick={() => setDescriptionVisible(false)} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
    </>
  )
}

export default App




// import { useState } from 'react'
// import * as React from 'react'
// import hseLogo from "./assets/hseLogo.png"
// import { Input, InputGroup, Kbd, Image, Text, Container, SegmentGroup, Stack, Box, Grid, StackSeparator,  GridItem, Center, ScrollArea } from "@chakra-ui/react"
// import { LuSearch } from "react-icons/lu"
// import './App.css'
// import data from "./data.json"
// function App() {
  
//   const [value, setValue] = useState<string | null>("Any")

//   return (
//     <>
//     <Container style={{ flexDirection: 'row', padding: 30, alignItems: 'center', marginBottom: '20px',  display: 'flex', height: '80px' }}>
//     <Image rounded="md" style={{ width: '100px' }} src={hseLogo} alt="HSE Logo" />
//     <Text style={{ flex: 1 }} >HSE Day of Service App</Text>
//     </Container>
//     {/* <Text>Day of service is a day, where instead of doing service, students across hse schools participate in leisurely activities within HSE, also check out LinkHands and Community AI App (Yet to be named)</Text> */}
//     <Text> Description</Text>
//       <InputGroup flex="1" startElement={<LuSearch />} >
//         <Input placeholder="Search contacts" />
//       </InputGroup>
//       <SegmentGroup.Root value={value} onValueChange={(e) => setValue(e.value)}>
//       <SegmentGroup.Indicator />
//       <SegmentGroup.Items items={["Any", "1", "2", "3", "5", "6", "7"]} />
//     </SegmentGroup.Root>
//     <Grid style={{ borderWidth: 1 }} templateColumns="repeat(3, 1fr)" gap={1}>
//           <GridItem colSpan={1}  width="100%" style={{borderTop: 0, borderLeft: 0, borderBottom: 0,  borderWidth: 1}}>
//             <Box h="20" justifyContent="center" alignItems="center" display="flex">
//             <Text>Activity Name</Text>
//             </Box>
//           </GridItem>
//           <GridItem colSpan={1} width="100%" style={{borderTop: 0, borderLeft: 0, borderBottom: 0,  borderWidth: 1}}>
//             <Box h="20" justifyContent="center" alignItems="center" display="flex">
//             <Text>Period</Text>
//             </Box>
//           </GridItem>
//           <GridItem colSpan={1} width="100%" style={{borderWidth: 0}}>
//             <Box h="20" justifyContent="center" alignItems="center" display="flex">
//             <Text>Teacher Name</Text>
//             </Box>
//           </GridItem>
//         </Grid>
//     <ScrollArea.Root height="400px" style={{ borderWidth: 1, marginTop: 10, padding: 10, borderRadius: 5, marginBottom: 20}}>
//             <ScrollArea.Viewport>
//               <ScrollArea.Content>
//     <Stack
//       style={{
        
//       }}

//       separator={<StackSeparator />}
//     >

//       {data.teachers.map((item) => (
//         <Grid style={{ borderWidth: 0}} templateColumns="repeat(3, 1fr)" gap={1}>
//           <GridItem colSpan={1}  width="100%" style={{borderTop: 0, borderLeft: 0, borderBottom: 0,  borderWidth: 1}}>
//             <Box h="20" justifyContent="center" alignItems="center" display="flex">
//             <Text>{item.activity}</Text>
//             </Box>
//           </GridItem>
//           <GridItem colSpan={1} width="100%" style={{borderTop: 0, borderLeft: 0, borderBottom: 0,  borderWidth: 1}}>
//             <Box h="20" justifyContent="center" alignItems="center" display="flex">
//             <Text>{item.period}</Text>
//             </Box>
//           </GridItem>
//           <GridItem colSpan={1} width="100%" style={{}}>
//             <Box h="20" justifyContent="center" alignItems="center" display="flex">
//             <Text>{item.name}</Text>
//             </Box>
//           </GridItem>
//         </Grid>
//       ))}
//     </Stack>
//     </ScrollArea.Content>
//     </ScrollArea.Viewport>
//     <ScrollArea.Scrollbar />
//           </ScrollArea.Root>
//     </>
//   )
// }

// export default App
