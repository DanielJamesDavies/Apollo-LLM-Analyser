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
			const old_value = JSON.parse(JSON.stringify(newLabels[index].name));
			newLabels[index].name = e?.target?.value;

			// If Word Variants Includes Old Value
			let words_to_collect_split = newLabels[index].words_to_collect.split(",").map((e) => e?.trim());
			const word_variant_name_index = words_to_collect_split?.findIndex((e) => e === old_value);
			if (word_variant_name_index === -1) {
				newLabels[index].words_to_collect = newLabels[index].name + ", " + newLabels[index].words_to_collect;
			} else {
				words_to_collect_split[word_variant_name_index] = newLabels[index].name;
				newLabels[index].words_to_collect = words_to_collect_split.join(", ");
			}

			return newLabels;
		});
	};

	const changeWordsToCollect = (e) => {
		setLabels((oldLabels) => {
			let newLabels = JSON.parse(JSON.stringify(oldLabels));
			newLabels[index].words_to_collect = e?.target?.value;
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
		changeWordsToCollect,
		deleteLabel,
		isCollectActivationsMenuOpen,
		selectedLabelsForCollection,
		toggleSelectLabelForCollection,
	};
};
