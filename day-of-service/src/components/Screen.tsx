import Home from '../pages/Home';
import HighSchool from '../pages/HighSchool';
import Intermediate from '../pages/Intermediate';
import Elementary from '../pages/Elementary';
import { useScreenContext } from '../contexts/ScreenContext';

export default function Screen() {
    const { currentScreen } = useScreenContext();
    const renderScreen = () => {
        switch (currentScreen) {
            case "home":
                return <Home />
            case "elementary":
                return <Elementary />
            case "intermediate":
                return <Intermediate />
            case "highschool":
                return <HighSchool />
            default:
                return <Home />
        }
    }
    return (
        <>
            {renderScreen()}
        </>
    )
}