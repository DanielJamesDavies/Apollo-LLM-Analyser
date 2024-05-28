// Packages
import { Chart } from "chart.js";
import { Scatter } from "react-chartjs-2";
import zoomPlugin from "chartjs-plugin-zoom";

// Components

// Logic
import { ActivationSpaceLogic } from "./ActivationSpaceLogic";

// Context

// Services

// Styles
import "./ActivationSpace.css";

// Assets
Chart.register(zoomPlugin);

export const ActivationSpace = () => {
	const { tsne_activations, collection_list, labels, label_colours, activation_space_style } = ActivationSpaceLogic();

	return (
		<div className='analyse-activations-activation-space' style={activation_space_style}>
			<Scatter
				data={{
					datasets: Object.keys(tsne_activations)?.map((key, i) => {
						const label_name = labels.find((e) => e.id === collection_list.find((e) => e.id === key)?.label_id)?.name;
						return {
							label: label_name,
							data: tsne_activations[key]?.map((e) => {
								return {
									x: e[1],
									y: e[2],
									label:
										label_name +
										" (" +
										e[0] +
										")" +
										" [" +
										Math.floor(e[1] * 1000) / 1000 +
										", " +
										Math.floor(e[2] * 1000) / 1000 +
										"]",
								};
							}),
							pointBackgroundColor: label_colours[i],
							borderColor: label_colours[i],
							pointRadius: 1.5,
						};
					}),
				}}
				options={{
					plugins: {
						zoom: {
							zoom: {
								wheel: {
									enabled: true,
									speed: 0.25,
								},
								pinch: {
									enabled: true,
								},
								mode: "xy",
								speed: 200,
							},
							pan: {
								enabled: true,
								mode: "xy",
								speed: 200,
							},
						},
						tooltip: {
							callbacks: {
								label: function (context) {
									return context.raw.label;
								},
							},
						},
					},
					scales: {
						x: {
							title: {
								display: true,
								font: {
									size: 14,
									weight: "bold",
								},
							},
						},
						y: {
							title: {
								display: true,
								font: {
									size: 14,
									weight: "bold",
								},
							},
						},
					},
				}}
			/>
		</div>
	);
};
