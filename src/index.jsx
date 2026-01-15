import { createRoot } from 'react-dom/client';

import { MainView } from "./components/main-view/main-view";
import { BrowserRouter } from "react-router-dom";
import { Container } from "react-bootstrap";

//import statement to indicate that you need to bundle `./index.scss`
import "./index.scss";

//Main Compnent (will eventually use all others)
const MovieMadnessApplication = () => {
    return (
        <BrowserRouter>
            <Container>
                <MainView />
            </Container>
        </BrowserRouter>
    )
};

//Finds the root of your app
const container = document.querySelector("#root");
const root = createRoot(container);

//Tells React to render your app in the root DOM element
root.render(<MovieMadnessApplication />);