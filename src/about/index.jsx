import React from "react";
import { Styled } from "./styled";

const About = () => (
    <Styled.Wrapper>
        <Styled.Main>
            <span className="aboutKicker">ABOUT THE DEMO</span>
            <h2>Practical overlay patterns for everyday interfaces.</h2>
            <p>Modal Pro is a focused React playground for building dialogs and drawers that feel predictable, useful and easy to reuse.</p>
            <p>The demo combines styled-components, localStorage persistence, confirmation flows, focus handling, keyboard controls and responsive presentation in one small project.</p>
            <h3>What it demonstrates</h3>
            <ul>
                <li>Modal and drawer placement with nested stacking</li>
                <li>ESC, backdrop and button close behavior</li>
                <li>Profile create, delete, clear and export actions</li>
                <li>Responsive layout with clear accessible controls</li>
            </ul>
            <h3>Future prospects</h3>
            <p>The component can grow into a small overlay toolkit with focus traps, compound dialog APIs, richer form validation and reusable drawer layouts.</p>
        </Styled.Main>
    </Styled.Wrapper>
);

export default About;