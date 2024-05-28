// Packages
import { useContext, useState } from "react";

// Components

// Logic

// Context
import { AnalyseContext } from "../../../../../../context/AnalyseContext";

// Services

// Styles

// Assets

export const LabelLogic = ({ label, index }) => {
	const { setLabels, isCollectActivationsMenuOpen, selectedLabelsForCollection, setSelectedLabelsForCollection } = useContext(AnalyseContext);

	const [expanded, setExpanded] = useState(false);

	const toggleExpanded = () => {
		setExpanded((oldExpanded) => !oldExpanded);
	};

	const changeName = (e) => {
		setLabels((oldLabels) => {
			let newLabels = JSON.parse(JSON.stringify(oldLabels));
			newLabels[index].name = e?.target?.value;
			return newLabels;
		});
	};

	const changeWordVariants = (e) => {
		setLabels((oldLabels) => {
			let newLabels = JSON.parse(JSON.stringify(oldLabels));
			newLabels[index].word_variants = e?.target?.value;
			return newLabels;
		});
	};

	const deleteLabel = () => {
		setLabels((oldLabels) => oldLabels.filter((_, i) => i !== index));
	};

	const toggleSelectLabelForCollection = () => {
		if (!isCollectActivationsMenuOpen) return false;
		setSelectedLabelsForCollection((oldValue) => {
			let newValue = JSON.parse(JSON.stringify(oldValue));
			const index = newValue.findIndex((e) => e === label?.id);
			if (index === -1) {
				newValue.push(label?.id);
			} else {
				newValue.splice(index, 1);
			}
			return newValue;
		});
	};

	return {
		expanded,
		toggleExpanded,
		changeName,
		changeWordVariants,
		deleteLabel,
		isCollectActivationsMenuOpen,
		selectedLabelsForCollection,
		toggleSelectLabelForCollection,
	};
};
