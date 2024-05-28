import { createContext, useState, useRef, useEffect, useCallback, useContext } from "react";
import { APIContext } from "./APIContext";

export const AnalyseContext = createContext();

const AnalyseProvider = ({ children }) => {
	const { APIRequest } = useContext(APIContext);
	const subpage_buttons = [
		{ id: "data", name: "Data Collection" },
		{ id: "activations", name: "Activation Space" },
		{ id: "analysis_models", name: "Analysis Models" },
	];
	const [curr_analyse_subpage_id, setCurrAnalyseSubpageId] = useState("data");

	// Data Collection
	const hasLoadedLabelsAndPrompts = useRef(false);
	const [labels, setLabels] = useState([]);
	const [prompts, setPrompts] = useState([]);
	const [hasSavedLabelsAndPrompts, setHasSavedLabelsAndPrompts] = useState(true);
	const setHasSavedLabelsAndPromptsTimeout = useRef();

	useEffect(() => {
		const get_labels_and_prompts = async () => {
			const labels_and_prompts_res = await APIRequest("/labels-and-prompts", "GET");
			if (labels_and_prompts_res?.labels && labels_and_prompts_res?.prompts) {
				setLabels(JSON.parse(labels_and_prompts_res?.labels));
				setPrompts(JSON.parse(labels_and_prompts_res?.prompts));
				setTimeout(() => {
					hasLoadedLabelsAndPrompts.current = true;
				}, 1000);
			}
		};
		get_labels_and_prompts();
	}, [setLabels, setPrompts, APIRequest]);

	const saveLabelsAndPrompts = useCallback(async () => {
		if (!hasLoadedLabelsAndPrompts?.current) return false;
		const save_res = await APIRequest("/labels-and-prompts", "PATCH", { labels, prompts });
		if (save_res?.message === "Success")
			setHasSavedLabelsAndPromptsTimeout.current = setTimeout(() => {
				setHasSavedLabelsAndPrompts(true);
			}, 1000);
	}, [labels, prompts, APIRequest]);

	const savingLabelsAndPromptsLastIntervalStartTime = useRef(0);
	useEffect(() => {
		if (hasLoadedLabelsAndPrompts?.current) {
			clearTimeout(setHasSavedLabelsAndPromptsTimeout.current);
			setHasSavedLabelsAndPrompts(false);

			const wait_time = 1000 * 2;

			let timeout = false;

			if (Math.max(-1, wait_time - (Date.now() - savingLabelsAndPromptsLastIntervalStartTime.current)) === -1) {
				saveLabelsAndPrompts();
				savingLabelsAndPromptsLastIntervalStartTime.current = Date.now();
			} else {
				timeout = setTimeout(() => {
					saveLabelsAndPrompts();
					savingLabelsAndPromptsLastIntervalStartTime.current = Date.now();
				}, Math.max(0, wait_time - (Date.now() - savingLabelsAndPromptsLastIntervalStartTime.current)));
			}

			return () => {
				clearTimeout(timeout);
			};
		}
	}, [savingLabelsAndPromptsLastIntervalStartTime, labels, prompts, saveLabelsAndPrompts, setHasSavedLabelsAndPrompts]);

	const [isCollectActivationsMenuOpen, setIsCollectActivationsMenuOpen] = useState(false);
	const [isCollectingActivations, setIsCollectingActivations] = useState(false);
	const [completedCollectingActivations, setCompletedCollectingActivations] = useState(false);
	const [selectedLabelsForCollection, setSelectedLabelsForCollection] = useState([]);
	const [selectedPromptsForCollection, setSelectedPromptsForCollection] = useState([]);
	const [min_collecting_layer_bound, setMinCollectingLayerBound] = useState(8);
	const [max_collecting_layer_bound, setMaxCollectingLayerBound] = useState(18);
	const [isCollectingAllTokens, setIsCollectingAllTokens] = useState(false);
	const [collectingTokensCount, setCollectingTokensCount] = useState(1);
	const [collectionGenerationsCount, setCollectionGenerationsCount] = useState(0);
	const [estimated_time_remaining, setEstimatedTimeRemaining] = useState("Calculating...");
	const [collection_time_completed, setCollectionTimeCompleted] = useState(0);
	const [collectionFileSize, setCollectionFileSize] = useState(0);

	const isCollectingActivationsRef = useRef(false);
	var runCollectActivationsLabelPromptInitialSeed = {};
	var runCollectActivationsLabelPromptCurrentSeed = {};
	var runCollectActivationsLabelCarousel = [];
	var runCollectActivationsPromptCarousel = [];
	var collection_runtime = 0;
	var collection_generations_count = 0;
	var start_time = 0;
	var collection_file_size_mb = 0;

	const spinLabelAndPromptCarousel = () => {
		// Get Label Id
		const label_id = runCollectActivationsLabelCarousel?.shift();
		runCollectActivationsLabelCarousel.push(label_id);

		// Get Prompt Id
		const prompt_id = runCollectActivationsPromptCarousel?.shift();
		runCollectActivationsPromptCarousel.push(prompt_id);

		return { label_id, prompt_id };
	};

	const has_reached_max_seed = (label_id, prompt_id) => {
		let reached_max_seed = false;
		let all_reached_max_seed = false;
		if (
			runCollectActivationsLabelPromptInitialSeed?.[label_id] !== undefined &&
			runCollectActivationsLabelPromptInitialSeed[label_id]?.[prompt_id] !== undefined &&
			runCollectActivationsLabelPromptCurrentSeed?.[label_id] !== undefined &&
			runCollectActivationsLabelPromptCurrentSeed[label_id]?.[prompt_id] !== undefined
		) {
			if (
				runCollectActivationsLabelPromptCurrentSeed[label_id][prompt_id] >=
				Math.max(runCollectActivationsLabelPromptInitialSeed[label_id][prompt_id] + 9, 10)
			) {
				reached_max_seed = true;
			}
		}

		if (reached_max_seed) {
			all_reached_max_seed =
				runCollectActivationsLabelCarousel
					.map((label_id) => {
						if (
							runCollectActivationsLabelPromptInitialSeed[label_id] === undefined ||
							runCollectActivationsLabelPromptCurrentSeed[label_id] === undefined
						)
							return false;
						return runCollectActivationsPromptCarousel.map((prompt_id) => {
							if (
								runCollectActivationsLabelPromptInitialSeed[label_id]?.[prompt_id] === undefined ||
								runCollectActivationsLabelPromptCurrentSeed[label_id]?.[prompt_id] === undefined
							)
								return false;
							if (
								runCollectActivationsLabelPromptCurrentSeed[label_id][prompt_id] >=
								Math.max(runCollectActivationsLabelPromptInitialSeed[label_id][prompt_id] + 9, 10)
							) {
								return true;
							}

							return false;
						});
					})
					.flat()
					.filter((e) => e === false).length === 0;
		}

		return { reached_max_seed, all_reached_max_seed };
	};

	const formatEstimatedTimeRemaining = (seconds_remaining) => {
		const hours = Math.floor(seconds_remaining / 3600);
		const minutes = Math.floor((seconds_remaining % 3600) / 60);
		const remaining_seconds = Math.floor(seconds_remaining % 60);

		return [
			hours.toString().padStart(2, "0") + "h",
			minutes.toString().padStart(2, "0") + "m",
			remaining_seconds.toString().padStart(2, "0") + "s",
		].join(", ");
	};

	const runCollectActivations = async (is_first) => {
		if (!isCollectingActivationsRef.current) return false;

		if (is_first) {
			setCollectionGenerationsCount(0);
			setEstimatedTimeRemaining("Calculating...");
			setCollectionFileSize(0);
			setCompletedCollectingActivations(false);
			start_time = Date.now();
			runCollectActivationsLabelPromptInitialSeed = {};
			runCollectActivationsLabelPromptCurrentSeed = {};
			runCollectActivationsLabelCarousel = JSON.parse(JSON.stringify(selectedLabelsForCollection));
			runCollectActivationsPromptCarousel = JSON.parse(JSON.stringify(selectedPromptsForCollection));
		}

		const { label_id, prompt_id } = spinLabelAndPromptCarousel();
		const { reached_max_seed, all_reached_max_seed } = has_reached_max_seed(label_id, prompt_id);

		if (all_reached_max_seed) {
			// Ending Collection of Activations
			isCollectingActivationsRef.current = false;
			setCompletedCollectingActivations(true);
			return false;
		} else if (reached_max_seed) {
			// Skipping if Reached Max Seed
			runCollectActivations();
			return false;
		}

		let body = {
			label_id,
			prompt_id,
			layers: min_collecting_layer_bound + "-" + max_collecting_layer_bound,
			token_options: isCollectingAllTokens ? "all" : Math.max(1, collectingTokensCount),
		};

		const run_collect_activations_res = await APIRequest("/collect-activations", "POST", body);
		console.log(run_collect_activations_res);
		if (run_collect_activations_res?.message === "Success") {
			collection_generations_count += 1;
			setCollectionGenerationsCount(collection_generations_count);

			// Ensure Correct Structures of Seed Saves
			if (runCollectActivationsLabelPromptInitialSeed[label_id] === undefined) {
				runCollectActivationsLabelPromptInitialSeed[label_id] = {};
			}
			if (runCollectActivationsLabelPromptInitialSeed[label_id]?.[prompt_id] === undefined) {
				runCollectActivationsLabelPromptInitialSeed[label_id][prompt_id] = run_collect_activations_res?.current_seed;
			}
			if (runCollectActivationsLabelPromptCurrentSeed[label_id] === undefined) {
				runCollectActivationsLabelPromptCurrentSeed[label_id] = {};
			}
			if (runCollectActivationsLabelPromptCurrentSeed[label_id]?.[prompt_id] === undefined) {
				runCollectActivationsLabelPromptCurrentSeed[label_id][prompt_id] = run_collect_activations_res?.current_seed;
			}

			// Save Current Seed
			runCollectActivationsLabelPromptCurrentSeed[label_id][prompt_id] = run_collect_activations_res?.current_seed;

			// Calculate Estimated Time
			collection_runtime += run_collect_activations_res?.elapsed_time;

			if (
				Math.max(collection_generations_count, selectedLabelsForCollection?.length * selectedPromptsForCollection?.length * 10) -
					collection_generations_count >
				0
			) {
				const new_estimated_seconds_remaining =
					(collection_runtime / collection_generations_count) *
					(Math.max(collection_generations_count, selectedLabelsForCollection?.length * selectedPromptsForCollection?.length * 10) -
						collection_generations_count);
				setEstimatedTimeRemaining(formatEstimatedTimeRemaining(new_estimated_seconds_remaining));
			} else {
				setCollectionTimeCompleted(formatEstimatedTimeRemaining(Math.floor((Date.now() - start_time) / 1000)));
			}

			// Set Collection File Size
			collection_file_size_mb += run_collect_activations_res?.activations_file_size_kb / 1000;
			setCollectionFileSize(collection_file_size_mb);

			// Recurse
			runCollectActivations();
		}
	};

	// Activation Space
	const [tsne_activations, setTsneActivations] = useState({});
	const [collection_list, setCollectionList] = useState([]);

	useEffect(() => {
		const get_collection_list = async () => {
			const collection_list_res = await APIRequest("/collection-list", "GET");
			if (collection_list_res?.collection_list) {
				setCollectionList(JSON.parse(collection_list_res?.collection_list));
			}
		};
		get_collection_list();
	}, [setCollectionList, APIRequest]);

	useEffect(() => {
		const get_tsne_activations = async () => {
			if (curr_analyse_subpage_id !== "activations") return false;
			const tsne_activations_res = await APIRequest("/tsne-activations?layer=7", "GET");
			if (tsne_activations_res?.tsne_json) {
				setTsneActivations(tsne_activations_res?.tsne_json);
			}
		};
		get_tsne_activations();
	}, [setTsneActivations, APIRequest, completedCollectingActivations, curr_analyse_subpage_id]);

	return (
		<AnalyseContext.Provider
			value={{
				subpage_buttons,
				curr_analyse_subpage_id,
				setCurrAnalyseSubpageId,
				labels,
				setLabels,
				prompts,
				setPrompts,
				hasSavedLabelsAndPrompts,
				isCollectActivationsMenuOpen,
				setIsCollectActivationsMenuOpen,
				isCollectingActivations,
				setIsCollectingActivations,
				isCollectingActivationsRef,
				completedCollectingActivations,
				setCompletedCollectingActivations,
				selectedLabelsForCollection,
				setSelectedLabelsForCollection,
				selectedPromptsForCollection,
				setSelectedPromptsForCollection,
				min_collecting_layer_bound,
				setMinCollectingLayerBound,
				max_collecting_layer_bound,
				setMaxCollectingLayerBound,
				isCollectingAllTokens,
				setIsCollectingAllTokens,
				collectingTokensCount,
				setCollectingTokensCount,
				collectionGenerationsCount,
				estimated_time_remaining,
				collection_time_completed,
				collectionFileSize,
				runCollectActivations,
				tsne_activations,
				collection_list,
			}}
		>
			{children}
		</AnalyseContext.Provider>
	);
};

export default AnalyseProvider;
