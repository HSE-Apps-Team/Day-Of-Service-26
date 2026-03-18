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
}

const records: DataItem[] = data.objects
const periodOptions = ["Any", ...Array.from(new Set(records.map((r) => r.Period)))]
const ageGroupOptions = [
  "Any",
  ...Array.from(new Set(records.map((r) => r["Age Group"]))),
]

function App() {
  const [query, setQuery] = useState("")
  const [period, setPeriod] = useState("Any")
  const [ageGroup, setAgeGroup] = useState("Any")

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

      <Text mb="2">Description</Text>

      <InputGroup flex="1" startElement={<LuSearch />}>
        <Input
          placeholder="Search by title, teacher, or location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>

      <Box mt="4">
        <Text mb="2">Filter by Period</Text>
        <SegmentGroup.Root
          defaultValue={"Any"}
          value={period}
          onValueChange={(e) => e.value && setPeriod(e.value)}
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items items={periodOptions} />
        </SegmentGroup.Root>
      </Box>

      <Box mt="4">
        <Text mb="2">Filter by Age Group</Text>
        <SegmentGroup.Root
          defaultValue={"Any"}
          value={ageGroup}
          onValueChange={(e) => e.value && setAgeGroup(e.value)}
        >
          <SegmentGroup.Indicator />
          <SegmentGroup.Items items={ageGroupOptions} />
        </SegmentGroup.Root>
      </Box>

      <Box mt="6">
        <Text mb="3">
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </Text>

        {filtered.length === 0 ? (
          <Text color="gray.500">No matching entries.</Text>
        ) : (
          filtered.map((item, index) => (
            <Box
              key={item.Title + item.Teacher + item.Period + index}
              p="3"
              mb="2"
              borderWidth="1px"
              borderRadius="md"
            >
              <Text fontWeight="semibold">{item.Title}</Text>
              <Text color="gray.600">Teacher: {item.Teacher}</Text>
              <Text color="gray.600">Period: {item.Period}</Text>
              <Text color="gray.600">Location: {item.Location}</Text>
              <Text color="gray.600">Age Group: {item["Age Group"]}</Text>
            </Box>
          ))
        )}
      </Box>
    </>
  )
}

export default App