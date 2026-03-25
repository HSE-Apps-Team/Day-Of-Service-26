
import NavBar from './components/NavBar';
import Screen from './components/Screen';
import { ScreenProvider } from './contexts/ScreenContext';

function App() {
  return (
    <ScreenProvider>
      <NavBar />
      <Screen />
    </ScreenProvider>
  );
}

export default App;



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
