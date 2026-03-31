import {Text, Box} from "@chakra-ui/react";

interface Props {
    teacherName: string;
    department: string | null;
    period: string;
    activityName: string;
}

export default function EnrichingStudentsDirections({ teacherName, department, period, activityName }: Props) {
        return (
                <Box style={{display: "flex", flexDirection: "column", alignItems: "flex-start", justifyContent: "center", padding: 20, textAlign: "left", marginTop: 20, borderWidth: 1, borderColor: "#0a569e", borderRadius: 8, backgroundColor: "#f7fafc"}}>
                        <Text fontSize={18} fontWeight="bold" mb="4">Enriching Students Directions</Text>
                        <Text fontSize={14} mb="2">1. Select April 24th on Enriching Students</Text>
                        <Text fontSize={14} mb="2">2. Select by Period: <b>"DAY OF SERVICE_Period {period}"</b>, click the blue <b>"Schedule Appointment"</b> link.</Text>
                        <Text fontSize={14} mb="2">3. Search in the top right "Filter by Teacher": <b>"{teacherName}"</b>, or by the teachers department: <b>{department}</b> </Text>
                <Text fontSize={14} mb="2">4. Find the activity, which will look something like: <b>"DAY OF SERVICE PERIOD {period}_{activityName}"</b></Text>
                        <Text fontSize={14} mb="2">5. Click the green "Period" button to change periods</Text>
                </Box>
        )
}

