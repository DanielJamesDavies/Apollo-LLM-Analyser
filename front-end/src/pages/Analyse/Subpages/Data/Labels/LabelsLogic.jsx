// Packages
import { useContext } from "react";

// Components

// Logic

// Context
import { AnalyseContext } from "../../../../../context/AnalyseContext";

// Services

// Styles

// Assets

export const LabelsLogic = () => {
	const { labels, setLabels, hasSavedLabelsAndPrompts, isCollectActivationsMenuOpen, isCollectingActivations } = useContext(AnalyseContext);

	const addLabel = () => {
		const new_id = URL.createObjectURL(new Blob()).split("/").pop();
		setLabels((oldLabels) => oldLabels.concat([{ id: new_id, name: "New Label", word_variants: "Word Variant 1, Word Variant 2" }]));
	};

	return { labels, addLabel, hasSavedLabelsAndPrompts, isCollectActivationsMenuOpen, isCollectingActivations };
};
