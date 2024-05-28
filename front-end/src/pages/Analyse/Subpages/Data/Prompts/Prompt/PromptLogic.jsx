// Packages
import { useContext, useEffect, useRef } from "react";

// Components

// Logic

// Context
import { AnalyseContext } from "../../../../../../context/AnalyseContext";

// Services

// Styles

// Assets

export const PromptLogic = ({ prompt, index }) => {
	const { setPrompts, isCollectActivationsMenuOpen, selectedPromptsForCollection, setSelectedPromptsForCollection } = useContext(AnalyseContext);

	const label_substring = useRef("  <|label|>  ");

	const changeName = (e) => {
		if (!e?.target?.value?.includes(label_substring?.current)) return false;
		setPrompts((oldPrompts) => {
			let newPrompts = JSON.parse(JSON.stringify(oldPrompts));
			newPrompts[index].name = e?.target?.value;
			const name_parts = newPrompts[index].name.split(label_substring?.current);
			newPrompts[index].name = name_parts.shift() + label_substring?.current + name_parts.join("");
			return newPrompts;
		});
	};

	const deletePrompt = () => {
		setPrompts((oldPrompts) => oldPrompts.filter((_, i) => i !== index));
	};

	const labelBoxRef = useRef();
	const isDraggingLabel = useRef(false);

	const onLabelMouseDown = () => {
		isDraggingLabel.current = true;
	};

	useEffect(() => {
		const onLabelMouseMove = (e) => {
			if (!isDraggingLabel.current) return false;
			const label_box_rect = labelBoxRef?.current?.getBoundingClientRect();
			const label_box_x = label_box_rect?.left + label_box_rect?.width / 2;
			const direction = e?.x - label_box_x;

			if (Math.abs(direction) > 20) {
				setPrompts((oldPrompts) => {
					let newPrompts = JSON.parse(JSON.stringify(oldPrompts));

					let new_name = newPrompts[index].name.split(label_substring?.current);
					let left = new_name[0];
					let right = new_name[1];

					if (direction < 0) {
						// Move Left
						newPrompts[index].name = [left.substring(0, left.length - 1), label_substring?.current, left[left.length - 1], right]
							.filter((e) => e !== undefined)
							.join("");
					} else {
						// Move Right
						newPrompts[index].name = [left, right[0], label_substring?.current, right.substring(1)]
							.filter((e) => e !== undefined)
							.join("");
					}

					return newPrompts;
				});
			}
		};

		const onLabelMouseUp = () => {
			isDraggingLabel.current = false;
		};

		window.addEventListener("mousemove", onLabelMouseMove);
		window.addEventListener("mouseup", onLabelMouseUp);
		return () => {
			window.removeEventListener("mousemove", onLabelMouseMove);
			window.removeEventListener("mouseup", onLabelMouseUp);
		};
	}, [setPrompts, index]);

	const toggleSelectPromptForCollection = () => {
		if (!isCollectActivationsMenuOpen) return false;
		setSelectedPromptsForCollection((oldValue) => {
			let newValue = JSON.parse(JSON.stringify(oldValue));
			const index = newValue.findIndex((e) => e === prompt?.id);
			if (index === -1) {
				newValue.push(prompt?.id);
			} else {
				newValue.splice(index, 1);
			}
			return newValue;
		});
	};

	return {
		changeName,
		deletePrompt,
		labelBoxRef,
		onLabelMouseDown,
		isCollectActivationsMenuOpen,
		selectedPromptsForCollection,
		toggleSelectPromptForCollection,
	};
};
