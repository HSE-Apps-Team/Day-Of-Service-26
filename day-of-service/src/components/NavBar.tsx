import {
    Image,
    Container,
    Text,
} from "@chakra-ui/react"
import hseLogo from "../assets/hseLogo.png"


const Navbar = () => (
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
                <Text width="80px"></Text>
    </Container>
)

export default Navbar