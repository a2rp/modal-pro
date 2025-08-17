import React from 'react'
import ModalPro from './modalPro'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import About from './about';

const App = () => {
    return (
        <>
            <ModalPro />
            <div style={{ height: "1px", backgroundColor: "#333" }} />
            <About />
            <ToastContainer
                position="bottom-right"
                theme="dark"
                autoClose={2500}
                newestOnTop
                closeOnClick
                pauseOnFocusLoss
                pauseOnHover
                draggable
                limit={3}
                toastStyle={{
                    background: "rgba(255,255,255,0.07)",
                    color: "#e8eaed",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
                }}
                progressStyle={{
                    background: "linear-gradient(90deg, var(--brand), var(--brand-2))",
                }}
            />
        </>
    )
}

export default App

