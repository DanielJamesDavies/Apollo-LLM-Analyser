// Packages
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";

// Components
import { Prompt } from "./Prompt/Prompt";

// Logic
import { PromptsLogic } from "./PromptsLogic";

// Context

// Services

// Styles
import "./Prompts.css";

// Assets

export const Prompts = () => {
	const { prompts, addPrompt, hasSavedLabelsAndPrompts, isCollectActivationsMenuOpen, isCollectingActivations } = PromptsLogic();

	return (
		<div className={"analyse-page-data-prompts" + (isCollectingActivations ? " analyse-page-data-prompts-is-collecting-activations" : "")}>
			<div className='analyse-page-data-prompts-header'>
				<div className='analyse-page-data-prompts-header-title'>Prompts</div>
				{hasSavedLabelsAndPrompts ? null : (
					<div className='analyse-page-data-prompts-header-saving'>
						<FontAwesomeIcon icon={faSave} />
						<span>Saving...</span>
					</div>
				)}
				<div className='analyse-page-data-prompts-header-buttons'>
					{isCollectActivationsMenuOpen ? null : (
						<button className='analyse-page-data-prompts-header-button' onClick={addPrompt}>
							<FontAwesomeIcon icon={faPlus} />
						</button>
					)}
				</div>
			</div>
			<div className='analyse-page-data-prompts-list'>
				{prompts?.map((prompt, index) => (
					<Prompt key={index} prompt={prompt} index={index} />
				))}
			</div>
		</div>
	);
};
