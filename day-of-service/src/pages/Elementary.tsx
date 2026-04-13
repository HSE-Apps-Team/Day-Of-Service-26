import { useMemo, useState } from "react"
import {
  Box,
  Container,
  Input,
  InputGroup,
  SegmentGroup,
  Text,
  ScrollArea,
  Stack,
  Dialog,
  Portal,
  CloseButton,
  Button,
  useMediaQuery,
} from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import data from "../data.json"
import { RiArrowLeftLine } from "react-icons/ri"
import { useScreenContext } from "../contexts/ScreenContext"
import NotForSignup from "../components/NotForSignup"

// FOR WHOEVER SEES THIS FILE WE ARE SORRY FOR THE HORRIBLE CODE BELOW, WE DID THIS IN A RUSH TO GET IT DONE IN TIME FOR THE DAY OF SERVICE.

type DataItem = {
  Title: string
  Teacher: string
  Period: string
  Location: string
  "Age Group": string
  Description?: string
  "Max Students"?: string
  Other?: string 
}
// `data.json` is an array of objects with lowercase keys (title, teacher, period, etc.).
// Map it to the `DataItem` shape the UI expects and normalize `period` to a string.
type RawItem = {
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
  "Max Students": d.max_students,
  Description: d.description,
  Other: d.other_instructors || "None",
}))
const periodOptions = ["1", "2", "3"]

export default function Elementary() {
  const { changeScreen } = useScreenContext();
  const [query, setQuery] = useState("")
  const [descriptionVisible, setDescriptionVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)
  const [period, setPeriod] = useState("1")
  const [ageGroup] = useState("elementary")

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
        item.Title?.toLowerCase().includes(q) ||
        item.Teacher?.toLowerCase().includes(q) ||
        item.Other?.toLowerCase().includes(q) ||
        item.Location?.toLowerCase().includes(q) ||
        item.Period?.toLowerCase().includes(q) ||
        item["Age Group"]?.toLowerCase().includes(q)
      )
    })
  }, [query, period, ageGroup])
const [isNarrow] = useMediaQuery(["(max-width: 850px)"]);
  return (
    <>
    <Container padding="4" borderRadius="8px" mt="4">
    <Container style={{  display: "flex", flexDirection: "row"}}>
    <Button color="#01539c" borderColor={"#01539c"} variant="outline" width="100px" mb="4" onClick={() => changeScreen("home")}>
        <RiArrowLeftLine/>Home
      </Button>
      <Text mb="2" style={{justifyContent: "center", alignSelf: "center", flex: 1, fontFamily: "Poppins, sans-serif", fontSize: 20 }}>Elementary Activities</Text>
            <Text width={isNarrow ? "0" : "100px"}></Text>
            </Container>
            <Container style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: isNarrow ? "stretch" : "center", flexDirection: isNarrow ? "column" : "row", gap: isNarrow ? "12px" : "0" }}>
                    <Box mt="4" style={{width: isNarrow ? "100%" : "30%"}}>
                      <Text mb="2">Filter by key words</Text> 
                  <InputGroup flex="1" style={{width: "100%"}}startElement={<LuSearch />}>
                    <Input
                      placeholder="Search by title, teacher, or location"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </InputGroup>
                  </Box>
                    <Text mt={isNarrow ? "0" : "10"} style={{fontFamily: "Poppins, sans-serif", color: "#656565ff", width: isNarrow ? "100%" : "auto", textAlign: isNarrow ? "center" : "center", order: isNarrow ? 3 : 2}}>
                      {filtered.length} result{filtered.length === 1 ? "" : "s"}
                    </Text>
                  <Box mt="4" style={{width: isNarrow ? "100%" : "30%", order: isNarrow ? 2 : 3}}>
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
      <Box mt="6">
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
                <Box key={index}
            onClick={() => {selectItem(item)}}
            className="item"
            _hover={{
            cursor: "pointer",
                 }}
            style={{ display: "flex", borderColor: "#0a569e", borderWidth: 1, color: "black", borderRadius: "8px", justifyContent: "space-between", padding: "10px"}}
                 >
                <Text>{isNarrow ? "P" : "Period "}{item.Period}</Text>
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
                <Text fontSize={20} marginBottom={10}>{selectedItem.Description || "No description available."}</Text>
                <Text marginBottom={1}>Host's Name: {selectedItem.Teacher}</Text>
                <Text marginBottom={1}>Location: {selectedItem.Location}</Text>
                <Text marginBottom={2}>Max Students: {selectedItem["Max Students"] || "Not specified"}</Text>
                <Text>Other Teacher's Involved: {selectedItem.Other}</Text>
                <NotForSignup />
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
    </Container>
    </>
  )
}
