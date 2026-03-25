import {
    Container,
    Text,
    InputGroup,
    Input,
    SegmentGroup,
    Grid,
    GridItem,
    Box,
    Button,
    Image,
}from "@chakra-ui/react"
import { useScreenContext } from "../contexts/ScreenContext"
import hseLogo from "../assets/hseLogo.png"

export default function Home() {
    const { changeScreen } = useScreenContext();
    return (
        <>
        <Text>Day of service is a day, where instead of doing service, students across hse schools participate in leisurely activities within HSE, also check out LinkHands and Community AI App (Yet to be named)</Text>
        <Container style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        <Box mt="4" style={{width: "30%", borderWidth: 1, borderRadius: 5, padding: 10}}>
            <Text fontWeight="bold" mb="2"> Elementary </Text>
            <Text fontSize={12}>For teachers of elementary classes</Text>
            <Button mt="2" colorScheme="blue" size="sm" onClick={() => changeScreen("elementary")}>
                Select
            </Button>
        </Box>
        <Box mt="4" style={{width: "30%", borderWidth: 1, borderRadius: 5, padding: 10}}>
            <Text fontWeight="bold" mb="2"> Intermediate </Text>
            <Text fontSize={12}>For teachers of intermediate classes</Text>
            <Button mt="2" colorScheme="blue" size="sm" onClick={() => changeScreen("intermediate")}>
                Select
            </Button>
        </Box>
        <Box mt="4" style={{width: "30%", borderWidth: 1, borderRadius: 5, padding: 10}}>
            <Text fontWeight="bold" mb="2"> High School </Text>
            <Text fontSize={12}>For students in HSE High School</Text>
            <Button mt="2" colorScheme="blue" size="sm" onClick={() => changeScreen("highschool")}>
                Select
            </Button>
        </Box>
        </Container>
        </>
    )
    }