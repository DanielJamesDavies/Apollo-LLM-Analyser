// Packages
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";

// Components

// Logic
import { PromptLogic } from "./PromptLogic";

// Context

// Services

// Styles
import "./Prompt.css";

// Assets

export const Prompt = ({ prompt, index }) => {
	const {
		changeName,
		deletePrompt,
		labelBoxRef,
		onLabelMouseDown,
		isCollectActivationsMenuOpen,
		selectedPromptsForCollection,
		toggleSelectPromptForCollection,
	} = PromptLogic({ prompt, index });

	return (
		<div
			className={
				"analyse-page-data-prompts-prompt" +
				(isCollectActivationsMenuOpen ? " analyse-page-data-prompts-prompt-container-collect-activations-menu-open" : "") +
				(selectedPromptsForCollection?.findIndex((e) => e === prompt?.id) !== -1
					? " analyse-page-data-prompts-prompt-container-selected-for-collection"
					: "")
			}
			onClick={toggleSelectPromptForCollection}
		>
			{isCollectActivationsMenuOpen ? (
				<div className='analyse-page-data-prompts-prompt-toggle-select-for-collection-btn-container'>
					<button className='analyse-page-data-prompts-prompt-toggle-select-for-collection-btn'>
						{selectedPromptsForCollection?.findIndex((e) => e === prompt?.id) === -1 ? (
							<FontAwesomeIcon icon={faPlus} />
						) : (
							<FontAwesomeIcon icon={faCheck} />
						)}
					</button>
				</div>
			) : null}
			<div className='analyse-page-data-prompts-prompt-name'>
				<div className='analyse-page-data-prompts-prompt-name-label'>
					{prompt?.name?.split("<|label|>")?.map((prompt_part, index) => (
						<span key={index} className='analyse-page-data-prompts-prompt-name-label-part'>
							<span key={index}>{prompt_part}</span>
							{index !== 0 ? null : <span>&nbsp;</span>}
							{index !== 0 ? null : (
								<span ref={labelBoxRef} className='analyse-page-data-prompts-prompt-name-label-box' onMouseDown={onLabelMouseDown}>
									<span>Label</span>
								</span>
							)}
							{index !== 0 ? null : <span>&nbsp;</span>}
							{index !== 0 ? null : <span>&nbsp;</span>}
						</span>
					))}
				</div>
				<input value={prompt?.name} onChange={changeName}></input>
			</div>
			<div className='analyse-page-data-prompts-prompt-manage'>
				<button className='analysis-page-data-prompts-prompt-delete-btn' onClick={deletePrompt}>
					<FontAwesomeIcon icon={faTrash} />
				</button>
			</div>
		</div>
	);
};
