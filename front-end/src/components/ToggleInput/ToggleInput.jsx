// Packages

// Components

// Logic

// Context

// Styles
import "./ToggleInput.css";

// Assets

export const ToggleInput = ({ value, onToggle }) => {
	return (
		<div className={value ? "toggle-input toggle-input-active" : "toggle-input"} onClick={onToggle}>
			<span className='toggle-input-slider' />
		</div>
	);
};
