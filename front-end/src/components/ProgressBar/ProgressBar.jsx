// Packages

// Components

// Logic

// Context

// Services

// Styles
import "./ProgressBar.css";

// Assets

export const ProgressBar = ({ className, value, label }) => {
	return (
		<div
			className={
				"progress-bar-container" +
				(value === 1 ? " progress-bar-container-loaded" : " progress-bar-container-loading") +
				(className ? " " + className : "")
			}
			style={{ "--progress": value }}
		>
			{!label ? null : (
				<div className='progress-bar-label'>
					{value === 1 ? "" : "Loading "}
					{label}
					{value === 1 ? " Loaded" : ""}
				</div>
			)}
			<div className='progress-bar'>
				<div className='progress-bar-progress-container'>
					<div className='progress-bar-progress'></div>
				</div>
				<div className='progress-bar-background'></div>
			</div>
		</div>
	);
};
