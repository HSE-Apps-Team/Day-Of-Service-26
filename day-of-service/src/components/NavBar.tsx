import {
    Image,
    Container,
    Text,
    useMediaQuery,
} from "@chakra-ui/react"
import hseLogo from "../assets/hseLogo.png"


const Navbar = () => {
  // useMediaQuery returns an array of booleans; destructure the first value
  const [isSmall] = useMediaQuery(["(max-width: 550px)"]);

  return (
    <Container
      style={{
        flexDirection: "row",
        padding: 30,
        alignItems: "center",
        marginBottom: "20px",
        marginTop: "20px",
        display: "flex",
        height: "80px",
      }}
    >
      <Image rounded="md" style={{ width: "100px" }} src={hseLogo} alt="HSE Logo" />
      {!isSmall && <Text style={{ flex: 1, fontSize: 30, fontFamily: "Poppins, sans-serif", fontWeight: "bold", color: "#01539c" }}>HSE Day of Service Opportunities</Text>}
      {isSmall && <Text style={{ flex: 1, fontSize: 20, fontFamily: "Poppins, sans-serif", fontWeight: "bold", color: "#01539c" }}>HSE Day of Service Opportunities</Text>}
      {!isSmall && <Text width="80px"></Text>}
    </Container>
  );
};

export default Navbar