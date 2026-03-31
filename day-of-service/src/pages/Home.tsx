import {
    Container,
    Text,
    Box,
    Button,
    useMediaQuery,
}from "@chakra-ui/react"
import { useScreenContext } from "../contexts/ScreenContext"

export default function Home() {
    const { changeScreen } = useScreenContext();
    const [isNarrow] = useMediaQuery(["(max-width: 850px)"]);
    return (
        <>
        <Text style={{ fontFamily: "Poppins, sans-serif", padding: 20, marginBottom: 50, fontSize: 14, color: "#656565ff", justifyContent: "center", alignSelf: "center", maxWidth: "500px" }}>Day of Service is a special day where students in HSE Schools participate in a plethora of unique activities at Hamilton Southeastern Highschool.</Text>
        <Container style={{ marginBottom: 50, display: "flex", justifyContent: isNarrow ? "center" : "space-between", flexWrap: "wrap", flexDirection: isNarrow ? "column" : "row", alignItems: isNarrow ? "center" : "stretch" }}>
        
        
        <Box mt="4" style={{width: isNarrow ? "100%" : "30%", maxWidth: "420px", borderWidth: 3, borderRadius: 5, padding: 10, paddingBottom: 50, paddingTop: 50, height: "250px", borderColor: "#01539c", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
            <Container>
            <Text fontWeight="bold" mb="2" mt="2"> High School </Text>
            <Text fontSize={12} style={{marginTop: 10}}>Activities for all students in Hamilton Southeastern High School</Text>
            </Container>
            <Button mt="2" width="70%" backgroundColor="#01539c" colorScheme="blue" size="sm" style={{}} onClick={() => changeScreen("highschool")}>
                Select
            </Button>
        </Box>
        <Box mt="4" style={{width: isNarrow ? "100%" : "30%", maxWidth: "420px", borderWidth: 3, borderRadius: 5, padding: 10, paddingBottom: 50, paddingTop: 50, height: "250px", borderColor: "#01539c", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
            <Container>
            <Text fontWeight="bold" mb="2" mt="2"> Intermediate </Text>
            <Text fontSize={12} style={{marginTop: 10}}>For teachers of intermediate classes, these activities are not available for High school students.</Text>
            </Container>
            <Button mt="2" width="70%" backgroundColor="#01539c" colorScheme="blue" size="sm" style={{}} onClick={() => changeScreen("intermediate")}>
                Select
            </Button>
        </Box>
        <Box mt="4" style={{width: isNarrow ? "100%" : "30%", maxWidth: "420px", borderWidth: 3, borderRadius: 5, padding: 10, paddingBottom: 50, paddingTop: 50, height: "250px", borderColor: "#01539c", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center"}}>
            <Container>
            <Text fontWeight="bold" mb="2" mt="2"> Elementary </Text>
            <Text fontSize={12} style={{marginTop: 10}}>For teachers of elementary classes, these activities are not available for High school students.</Text>
            </Container>
            <Button mt="2" width="70%" backgroundColor="#01539c" colorScheme="blue" size="sm" style={{}} onClick={() => changeScreen("elementary")}>
                Select
            </Button>
        </Box>
        </Container>
        </>
    )
    }