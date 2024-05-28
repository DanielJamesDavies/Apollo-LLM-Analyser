// Packages

// Components

// Logic
import { SubpageButtonsLogic } from "./SubpageButtonsLogic";

// Context

// Services

// Styles
import "./SubpageButtons.css";

// Assets

export const SubpageButtons = () => {
	const { subpage_buttons, curr_analyse_subpage_id, onClickSubpage } = SubpageButtonsLogic();

	return (
		<div className='analyse-subpage-buttons'>
			{subpage_buttons?.map((subpage_button, index) => (
				<div
					key={index}
					className={"analyse-subpage-button" + (subpage_button?.id === curr_analyse_subpage_id ? " analyse-subpage-button-active" : "")}
					onClick={() => onClickSubpage(subpage_button?.id)}
				>
					<div className='analyse-subpage-button-content'>{subpage_button?.name}</div>
				</div>
			))}
		</div>
	);
};
