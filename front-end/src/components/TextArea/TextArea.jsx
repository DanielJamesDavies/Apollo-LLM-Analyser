// Packages
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

// Components

// Logic
import { TextAreaLogic } from "./TextAreaLogic";

// Context

// Services

// Styles
import "./TextArea.css";

// Assets

export const TextArea = ({ className, value, onChange, onSubmit, placeholder, disableSubmit }) => {
	const { textareaRef, onKeyDown } = TextAreaLogic({ value, onSubmit, disableSubmit });

	return (
		<div
			className={
				"text-area-container" +
				(value?.length === 0 ? " text-area-container-empty" : "") +
				(className ? " " + className : "") +
				(disableSubmit ? " text-area-container-disable-submit" : "")
			}
		>
			<textarea
				ref={textareaRef}
				value={value}
				onChange={onChange}
				placeholder={placeholder ? placeholder : "Type here"}
				onKeyDown={onKeyDown}
			/>
			{onSubmit === undefined ? null : (
				<button className='text-area-submit-btn' onClick={onSubmit}>
					<FontAwesomeIcon icon={faPaperPlane} />
				</button>
			)}
		</div>
	);
};
