// Packages
import { useEffect, useRef } from "react";

// Components

// Logic

// Context

// Services

// Styles

// Assets

export const TextAreaLogic = ({ value, onSubmit, disableSubmit }) => {
	const textareaRef = useRef(null);

	useEffect(() => {
		const textarea = textareaRef.current;
		if (textarea) {
			textarea.style.height = "1px";
			textarea.style.height = `${textarea.scrollHeight}px`;
		}
	}, [value]);

	const onKeyDown = (e) => {
		if (onSubmit !== undefined && !e?.ctrlKey && e?.code === "Enter" && !disableSubmit) {
			e?.preventDefault();
			return onSubmit();
		}
	};

	return { textareaRef, onKeyDown };
};
