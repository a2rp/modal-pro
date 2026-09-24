import styled from "styled-components";

const Shell = styled.div`
    min-height: 100vh;
    padding: 42px 0 72px;
`;

const Content = styled.div`
    width: min(1120px, 94vw);
    display: grid;
    gap: 18px;
    margin: 0 auto;
`;

const Panel = styled.div`
    width: 100%;
    padding: clamp(18px, 3vw, 28px);
    border: 1px solid var(--border);
    border-radius: 20px;
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.055), rgba(255, 255, 255, 0.015));
    box-shadow: 0 18px 55px rgba(0, 0, 0, 0.18);
`;

const Kicker = styled.span`
    display: block;
    color: var(--brand-2);
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 0.15em;
`;

const Title = styled.h1`
    margin: 8px 0 5px;
    color: var(--text);
    font-size: clamp(1.8rem, 4vw, 3.8rem);
    letter-spacing: -0.06em;
`;

const Sub = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0 0 18px;
    color: var(--muted);
    line-height: 1.6;
`;

const Row = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
`;

export const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: ${({ $z }) => $z};
    background: rgba(0, 0, 0, 0.62);
    backdrop-filter: blur(7px);
`;

export const DialogCard = styled.div`
    width: min(520px, 96vw);
    padding: 22px;
    border: 1px solid var(--border);
    border-radius: 18px;
    color: var(--text);
    background: var(--card);
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
`;

export const DrawerPanel = styled.div`
    position: fixed;
    ${({ $side }) => $side === "left" ? "left:0; top:0; bottom:0;" : $side === "right" ? "right:0; top:0; bottom:0;" : $side === "top" ? "top:0; left:0; right:0;" : "bottom:0; left:0; right:0;"}
    width: ${({ $side }) => $side === "left" || $side === "right" ? "min(440px, 94vw)" : "auto"};
    height: ${({ $side }) => $side === "top" || $side === "bottom" ? "min(72vh, 100%)" : "100%"};
    padding: 22px;
    border: 1px solid var(--border);
    border-radius: ${({ $side }) => $side === "left" ? "0 18px 18px 0" : $side === "right" ? "18px 0 0 18px" : $side === "top" ? "0 0 18px 18px" : "18px 18px 0 0"};
    color: var(--text);
    background: var(--card);
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
`;

export const Styled = { Shell, Content, Panel, Kicker, Title, Sub, Row };