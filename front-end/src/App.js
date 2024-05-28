import { Routes } from "./components/Routes/Routes";

import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";

function App() {
	return (
		<div className='App'>
			<Routes />
			<div className='app-unsupported-window-size-container'>
				<FontAwesomeIcon icon={faWarning} />
				<span>Unsupported Window Size</span>
			</div>
		</div>
	);
}

export default App;
