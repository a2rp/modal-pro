import styled, { keyframes } from "styled-components";

const Shell = styled.div`
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 28px;
`;

const Panel = styled.div`
    width: min(920px, 96vw);
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.02),
        rgba(255, 255, 255, 0.005)
    );
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 20px;
`;

const Title = styled.h1`
    margin: 6px 0 2px;
`;

const Sub = styled.div`
    color: var(--muted);
    margin: 0 0 16px;
    display: flex;
    justify-content: space-between;
`;

const Row = styled.div`
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
`;

const fadeIn = keyframes`
  from { opacity: 0 } to { opacity: 1 }
`;

export const Overlay = styled.div`
    position: fixed;
    inset: 0;
    z-index: ${({ $z }) => $z};
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(6px);
    animation: ${fadeIn} 0.16s ease both;
`;

export const DialogCard = styled.div`
    width: min(520px, 96vw);
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 18px;
    color: var(--text);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
`;

export const DrawerPanel = styled.div`
    position: fixed;
    ${({ $side }) =>
        $side === "left"
            ? "left:0; top:0; bottom:0;"
            : $side === "right"
            ? "right:0; top:0; bottom:0;"
            : $side === "top"
            ? "top:0; left:0; right:0; height:auto;"
            : "bottom:0; left:0; right:0; height:auto;"}
    width: ${({ $side }) =>
        $side === "left" || $side === "right" ? "min(420px, 96vw)" : "auto"};
    height: ${({ $side }) =>
        $side === "top" || $side === "bottom" ? "min(70vh, 96vh)" : "100%"};
    background: var(--card);
    border: 1px solid var(--border);
    ${({ $side }) =>
        $side === "left"
            ? "border-right: none"
            : $side === "right"
            ? "border-left: none"
            : $side === "top"
            ? "border-bottom: none"
            : "border-top: none"};
    border-radius: ${({ $side }) =>
        $side === "left"
            ? "0 12px 12px 0"
            : $side === "right"
            ? "12px 0 0 12px"
            : $side === "top"
            ? "0 0 12px 12px"
            : "12px 12px 0 0"};
    padding: 18px;
    color: var(--text);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
    transform: translate3d(
        ${({ $side, $open }) => {
            if ($open) return "0,0,0";
            if ($side === "left") return "-100%,0,0";
            if ($side === "right") return "100%,0,0";
            if ($side === "top") return "0,-100%,0";
            return "0,100%,0";
        }}
    );
    transition: transform 0.2s ease;
`;

export const Styled = { Shell, Panel, Title, Sub, Row };
