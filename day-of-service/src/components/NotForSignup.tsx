import { Box } from '@chakra-ui/react';
import React from 'react';

const NotForSignup: React.FC = () => {
    return (
        <Box style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20, textAlign: "center", backgroundColor: "#ffeaea", color: "black", border: "1px solid red", borderRadius: 8, marginTop: 20}}>
            <h1 style={{fontSize: 24, fontWeight: "bold", marginBottom: 20}}>This is not available for high school students.</h1>
            <p style={{fontSize: 16}}>Please return to the home page and select <b>"High School"</b> to sign up for activities.</p>
        </Box>
    );
};

export default NotForSignup;