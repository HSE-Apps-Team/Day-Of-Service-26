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
import { ThemeContext } from "../contexts/themeContext";
import { useContext } from "react";

export default function Home() {
    const theme = useContext(ThemeContext).theme.colors
    const { changeScreen } = useScreenContext();
    return (
        <>
        <Text>Day of Service is a special day where students in HSE Schools participate in a plethora of unique activities at Hamilton Southeastern Highschool.</Text>
        <Container style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
        <Box mt="4" style={{width: "30%", borderWidth: 1, borderRadius: 5, padding: 10}}>
            <Text fontWeight="bold" mb="2"> Elementary </Text>
            <Text fontSize={12}>For teachers of elementary classes</Text>
            <Button mt="2" backgroundColor="#0a569e" colorScheme="blue" size="sm" onClick={() => changeScreen("elementary")}>
                Select
            </Button>
        </Box>
        <Box mt="4" style={{width: "30%", borderWidth: 1, borderRadius: 5, padding: 10}}>
            <Text fontWeight="bold" mb="2"> Intermediate </Text>
            <Text fontSize={12}>For teachers of intermediate classes</Text>
            <Button mt="2" backgroundColor="#0a569e" colorScheme="blue" size="sm" onClick={() => changeScreen("intermediate")}>
                Select
            </Button>
        </Box>
        <Box mt="4" style={{width: "30%", borderWidth: 1, borderRadius: 5, padding: 10}}>
            <Text fontWeight="bold" mb="2"> High School </Text>
            <Text fontSize={12}>For students in HSE High School</Text>
            <Button mt="2" backgroundColor="#0a569e" colorScheme="blue" size="sm" onClick={() => changeScreen("highschool")}>
                Select
            </Button>
        </Box>
        </Container>
        </>
    )
    }