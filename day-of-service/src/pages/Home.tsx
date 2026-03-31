import {
    Container,
    Text,
    Box,
    Button,
}from "@chakra-ui/react"
import { useScreenContext } from "../contexts/ScreenContext"

export default function Home() {
    const { changeScreen } = useScreenContext();
    return (
        <>
        <Text style={{ fontFamily: "Poppins, sans-serif", padding: 20, marginBottom: 50, fontSize: 14, color: "#656565ff", width: "500px", justifyContent: "center", alignSelf: "center" }}>Day of Service is a special day where students in HSE Schools participate in a plethora of unique activities at Hamilton Southeastern Highschool.</Text>
        <Container style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        <Box mt="4" style={{width: "30%", borderWidth: 3, borderRadius: 5, padding: 10, height: "250px", borderColor: "#01539c"}}>
            <Text fontWeight="bold" mb="2" mt="2"> Elementary </Text>
            <Text fontSize={12} style={{marginTop: 10}}>For teachers of elementary classes</Text>
            <Button mt="2" width="70%" backgroundColor="#01539c" colorScheme="blue" size="sm" style={{marginTop: 90}} onClick={() => changeScreen("elementary")}>
                Select
            </Button>
        </Box>
        <Box mt="4" style={{width: "30%", borderWidth: 3, borderRadius: 5, padding: 10, height: "250px", borderColor: "#01539c"}}>
            <Text fontWeight="bold" mb="2" mt="2"> Intermediate </Text>
            <Text fontSize={12} style={{marginTop: 10}}>For teachers of intermediate classes</Text>
            <Button mt="2" width="70%" backgroundColor="#01539c" colorScheme="blue" size="sm" style={{marginTop: 90}} onClick={() => changeScreen("intermediate")}>
                Select
            </Button>
        </Box>
        <Box mt="4" style={{width: "30%", borderWidth: 3, borderRadius: 5, padding: 10, height: "250px", borderColor: "#01539c"}}>
            <Text fontWeight="bold" mb="2" mt="2"> High School </Text>
            <Text fontSize={12} style={{marginTop: 10}}>For students in HSE High School</Text>
            <Button mt="2" width="70%" backgroundColor="#01539c" colorScheme="blue" size="sm" style={{marginTop: 90}} onClick={() => changeScreen("highschool")}>
                Select
            </Button>
        </Box>
        </Container>
        </>
    )
    }