import React from "react";

export default function Navbar() {
	const scrollToSection = (id) => {
		const el = document.getElementById(id);
		if (el) {
			el.scrollIntoView({ behavior: "smooth", block: id === "about" ? "end" : "start" });
		}
	};

		return (
			<nav style={{
				width: "100%",
				background: "#888888",
				padding: "16px 0",
				display: "flex",
				justifyContent: "center",
				gap: "40px",
				position: "sticky",
				top: 0,
				zIndex: 1000,
				boxShadow: "0 2px 8px rgba(0,0,0,0.07)"
			}}>
			<button onClick={() => scrollToSection("hero-section")} style={navBtnStyle}>Home</button>
			<button onClick={() => scrollToSection("predict-section")} style={navBtnStyle}>Predict Home</button>
			<button onClick={() => scrollToSection("about-section")} style={navBtnStyle}>About</button>
		</nav>
	);
}

const navBtnStyle = {
	background: "none",
	border: "none",
	color: "white",
	fontSize: "1.1rem",
	fontWeight: "bold",
	cursor: "pointer",
	padding: "8px 18px",
	borderRadius: "5px",
	transition: "background 0.2s",
};
