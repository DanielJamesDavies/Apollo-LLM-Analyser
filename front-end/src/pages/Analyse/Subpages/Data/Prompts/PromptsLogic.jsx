// Packages
import { useContext } from "react";

// Components

// Logic

// Context
import { AnalyseContext } from "../../../../../context/AnalyseContext";

// Services

// Styles

// Assets

export const PromptsLogic = () => {
	const { prompts, setPrompts, hasSavedLabelsAndPrompts, isCollectActivationsMenuOpen, isCollectingActivations } = useContext(AnalyseContext);

	const addPrompt = () => {
		const new_id = URL.createObjectURL(new Blob()).split("/").pop();
		setPrompts((oldPrompts) => oldPrompts.concat([{ id: new_id, name: "In one sentence, please tell me about:  <|label|>  " }]));
	};

	return { prompts, addPrompt, hasSavedLabelsAndPrompts, isCollectActivationsMenuOpen, isCollectingActivations };
};
