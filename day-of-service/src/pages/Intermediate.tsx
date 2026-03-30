import { useMemo, useState, useContext } from "react"
import hseLogo from "../assets/hseLogo.png"
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
    Button,
} from "@chakra-ui/react"
import { LuSearch } from "react-icons/lu"
import data from "../data.json"
import { RiArrowLeftLine } from "react-icons/ri"
import { useScreenContext } from "../contexts/ScreenContext"
import { ThemeContext } from "../contexts/themeContext"
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
const periodOptions = ["5", "6", "7"]
const ageGroupOptions = [
  "Any",
  ...Array.from(new Set(records.map((r) => r["Age Group"]))),
]

export default function Intermediate() {
  const theme = useContext(ThemeContext).theme.colors
  const { changeScreen } = useScreenContext();
  const [query, setQuery] = useState("")
  const [descriptionVisible, setDescriptionVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DataItem | null>(null)
  const [period, setPeriod] = useState("5")
  const [ageGroup, setAgeGroup] = useState("intermediate")

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
        item.Location?.toLowerCase().includes(q) ||
        item.Period?.toLowerCase().includes(q) ||
        item["Age Group"]?.toLowerCase().includes(q)
      )
    })
  }, [query, period, ageGroup])

  return (
    <>
      <Container backgroundColor="gray" padding="4" borderRadius="8px" mt="4">
          <Container style={{  display: "flex", flexDirection: "row"}}>
          <Button colorPalette="teal" variant="outline" width="100px" mb="4" onClick={() => changeScreen("home")}>
              <RiArrowLeftLine/>Home
            </Button>
            <Text mb="2" style={{justifyContent: "center", alignSelf: "center", flex: 1}}>Intermediate Opportunities</Text>
            <Text width="100px"></Text>
            </Container>
      <Container style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center" }}>
        <Box mt="4" style={{width: "30%"}}>
          <Text mb="2">Filter by key words.</Text> 
      <InputGroup flex="1" style={{width: "80%"}}startElement={<LuSearch />}>
        <Input
          placeholder="Search by title, teacher, or location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>
      </Box>
        <Text mt="10">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </Text>
      <Box mt="4" style={{width: "30%"}}>
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
   <ScrollArea.Root height="400px" style={{marginTop: 5, padding: 10, marginBottom: 20}}>
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
            _hover={{
            cursor: "pointer",
                 }}
            style={{ display: "flex", borderColor: "#b01f1fff", borderWidth: 1, backgroundColor: "#bababaff", color: "black", borderRadius: "8px", justifyContent: "space-between", padding: "10px"}}
                 >
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
                <Text fontSize={20} marginBottom={10}>{selectedItem.Description || "No description available."}</Text>
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
    </Container>
    </>
  )
}
