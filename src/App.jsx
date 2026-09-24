import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    FiArrowUp,
    FiCode,
    FiCoffee,
    FiFacebook,
    FiGithub,
    FiGlobe,
    FiHeart,
    FiLinkedin,
    FiMail,
    FiMenu,
    FiStar,
    FiX,
    FiYoutube,
} from "react-icons/fi";
import About from "./about";
import ModalPro from "./modalPro";

const socialLinks = [
    { label: "Portfolio", href: "https://www.ashishranjan.net/", icon: FiGlobe },
    { label: "GitHub", href: "https://github.com/a2rp", icon: FiGithub },
    { label: "CodePen", href: "https://codepen.io/ash1198", icon: FiCode },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", icon: FiLinkedin },
    { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", icon: FiFacebook },
    { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", icon: FiYoutube },
    { label: "Email", href: "mailto:ash.ranjan09@gmail.com", icon: FiMail },
];

const supportLinks = [
    { label: "Support", href: "https://a2rp-donation-page.netlify.app/", icon: FiHeart },
    { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/a2rp", icon: FiCoffee },
    { label: "Patreon", href: "https://patreon.com/a2rp", icon: FiStar },
];

const FooterLinks = ({ links }) => (
    <div className="footerLinks">
        {links.map(({ label, href, icon }) => (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} aria-label={label} title={label}>
                {React.createElement(icon)}
            </a>
        ))}
    </div>
);

const App = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const closeMenu = () => setMenuOpen(false);

    return (
        <div className="appShell">
            <header className="siteHeader">
                <a className="siteBrand" href="#demo" onClick={closeMenu}>
                    <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ashish Ranjan logo" />
                    <span><small>A2RP COMPONENTS</small><strong>Modal Pro</strong></span>
                </a>
                <nav className={`siteNav ${menuOpen ? "siteNavOpen" : ""}`} aria-label="Main navigation">
                    <a href="#demo" onClick={closeMenu}>Demo</a>
                    <a href="#about" onClick={closeMenu}>About</a>
                    <a href="#footer" onClick={closeMenu}>Links</a>
                </nav>
                <button className="menuButton" type="button" onClick={() => setMenuOpen((open) => !open)} aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen}>
                    {menuOpen ? <FiX /> : <FiMenu />}
                </button>
            </header>

            <main className="siteMain">
                <section id="demo" aria-label="Modal and drawer demo"><ModalPro /></section>
                <section id="about" aria-label="About this project"><About /></section>
            </main>

            <footer id="footer" className="siteFooter">
                <div className="footerIntro"><span className="eyebrow">KEEP EXPLORING</span><h2>Small interaction patterns with practical details.</h2></div>
                <div className="footerColumns">
                    <div><span className="footerLabel">Links</span><FooterLinks links={socialLinks} /></div>
                    <div><span className="footerLabel">Support</span><FooterLinks links={supportLinks} /></div>
                </div>
                <div className="footerBottom"><span>Copyright &copy; {new Date().getFullYear()} <a href="https://www.ashishranjan.net/" target="_blank" rel="noopener noreferrer">Ashish Ranjan</a></span><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Go to top"><FiArrowUp /></button></div>
            </footer>

            <ToastContainer position="bottom-right" theme="dark" autoClose={2500} newestOnTop closeOnClick pauseOnFocusLoss pauseOnHover draggable limit={3} />
        </div>
    );
};

export default App;