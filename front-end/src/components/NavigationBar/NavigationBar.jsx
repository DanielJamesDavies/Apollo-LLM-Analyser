// Packages
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassChart, faMessage } from "@fortawesome/free-solid-svg-icons";

// Components

// Logic
import { NavigationBarLogic } from "./NavigationBarLogic";

// Context

// Services

// Styles
import "./NavigationBar.css";

// Assets

export const NavigationBar = () => {
	const { location, goToPage } = NavigationBarLogic();

	return (
		<div className='navigation-bar'>
			<div className='navigation-bar-title-container' onClick={() => goToPage("/")}>
				<img src='/symbol.png' alt='' />
				<div className='navigation-bar-titles'>
					<div className='navigation-bar-title'>Apollo</div>
					<div className='navigation-bar-subtitle'>LLM Analyser</div>
				</div>
			</div>
			<div className='navigation-bar-buttons'>
				<button
					className={
						"navigation-bar-button" +
						(location.pathname.substring(1).length === 0 || location.pathname.substring(1).split("/")[0] === "chat"
							? " navigation-bar-button-active"
							: "")
					}
					onClick={() => goToPage("/")}
				>
					<FontAwesomeIcon icon={faMessage} />
					<span>Chat</span>
				</button>
				<button
					className={
						"navigation-bar-button" +
						(location.pathname.substring(1).split("/")[0] === "analyse" ? " navigation-bar-button-active" : "")
					}
					onClick={() => goToPage("/analyse")}
				>
					<FontAwesomeIcon icon={faMagnifyingGlassChart} />
					<span>Analyse</span>
				</button>
			</div>
			<div className='navigation-bar-llm-active'>Using Gemma 7B</div>
		</div>
	);
};
