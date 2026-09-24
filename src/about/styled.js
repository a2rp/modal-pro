import styled from "styled-components";

export const Styled = {
    Wrapper: styled.div`
        width: min(1120px, 94vw);
        margin: 0 auto;
        padding: 20px 0 92px;
    `,
    Main: styled.div`
        max-width: 780px;
        padding: clamp(20px, 4vw, 36px);
        border: 1px solid var(--border);
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.025);

        h2 {
            max-width: 680px;
            margin: 8px 0 18px;
            font-size: clamp(2rem, 5vw, 4.4rem);
            line-height: 1;
            letter-spacing: -0.06em;
        }

        h3 {
            margin-top: 32px;
            color: var(--brand-2);
        }

        p, li {
            color: var(--muted);
            line-height: 1.75;
        }

        ul {
            padding-left: 20px;
        }
    `,
};