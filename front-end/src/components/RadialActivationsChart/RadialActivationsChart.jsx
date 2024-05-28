// Packages
import { useCallback, useEffect, useState } from "react";
import "chart.js/auto";
import { Radar } from "react-chartjs-2";

// Components

// Logic

// Context

// Services

// Styles
import "./RadialActivationsChart.css";

// Assets

export const RadialActivationsChart = ({ data, tokens }) => {
	// If layer_number is more than data length, it displays log values for the data. layer_number - data.length > 0 is for log values.
	const [layer_number, setLayerNumber] = useState(1);
	const [has_controlled_layer_number, setHasControlledLayerNumber] = useState(false);
	const [data_log, setDataLog] = useState([[]]);
	const [upper_outlier_thresholds, setUpperOutlierThresholds] = useState([]);
	const [upper_outlier_thresholds_log, setUpperOutlierThresholdsLog] = useState([]);

	useEffect(() => {
		setDataLog(data.map((row) => row.map((value) => Math.abs(Math.log(Math.abs(value))))));
	}, [data, setDataLog]);

	const onKeyDown = useCallback(
		(e) => {
			e.preventDefault();

			if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e?.code)) {
				setHasControlledLayerNumber(true);

				switch (e?.code) {
					case "ArrowLeft":
						setLayerNumber((oldLayerNumber) => (oldLayerNumber <= 1 ? 1 : oldLayerNumber - 1));
						break;
					case "ArrowRight":
						setLayerNumber((oldLayerNumber) => (oldLayerNumber >= data.length * 2 ? data.length * 2 : oldLayerNumber + 1));
						break;
					case "ArrowUp":
						setLayerNumber((oldLayerNumber) => (oldLayerNumber - data.length > 0 ? oldLayerNumber - data.length : oldLayerNumber));
						break;
					case "ArrowDown":
						setLayerNumber((oldLayerNumber) => (oldLayerNumber - data.length > 0 ? oldLayerNumber : oldLayerNumber + data.length));
						break;
					default:
						break;
				}
			}
		},
		[setHasControlledLayerNumber, data]
	);

	useEffect(() => {
		window.addEventListener("keydown", onKeyDown);
		return () => window.removeEventListener("keydown", onKeyDown);
	}, [onKeyDown]);

	useEffect(() => {
		if (!has_controlled_layer_number) {
			setLayerNumber(1);
			const interval = setInterval(() => {
				setLayerNumber((oldLayerNumber) => (oldLayerNumber >= data.length * 2 ? 1 : oldLayerNumber + 1));
			}, 1500);
			return () => clearInterval(interval);
		}
	}, [setLayerNumber, data, has_controlled_layer_number]);

	useEffect(() => {
		let newUpperOutlierThresholds = data.map((layer) => {
			let new_layer_data = JSON.parse(JSON.stringify(layer));
			new_layer_data.sort((a, b) => a - b);
			const Q1 = new_layer_data[Math.floor(new_layer_data.length / 4)];
			const Q3 = new_layer_data[Math.floor(new_layer_data.length * (3 / 4))];
			const IQR = Q3 - Q1;
			return Q3 + 1.5 * IQR;
		});
		let newUpperOutlierThresholdsLog = data_log.map((layer) => {
			let new_layer_data = JSON.parse(JSON.stringify(layer));
			new_layer_data.sort((a, b) => a - b);
			const Q1 = new_layer_data[Math.floor(new_layer_data.length / 4)];
			const Q3 = new_layer_data[Math.floor(new_layer_data.length * (3 / 4))];
			const IQR = Q3 - Q1;
			return Q3 + 1.5 * IQR;
		});
		setUpperOutlierThresholds(newUpperOutlierThresholds);
		setUpperOutlierThresholdsLog(newUpperOutlierThresholdsLog);
	}, [data, data_log, setUpperOutlierThresholds, setUpperOutlierThresholdsLog]);

	return (
		<div
			className={
				"radial-activations-chart-container" +
				(layer_number - data?.length > 0 ? " radial-activations-chart-container-is-on-log-scale" : "")
			}
		>
			<div className='radial-activations-chart'>
				<Radar
					data={{
						labels: Array.from({ length: data[0]?.length }, () => undefined),
						datasets: [
							{
								data: !data
									? []
									: layer_number - data?.length > 0
									? data_log?.[layer_number - data.length - 1].map((value) =>
											value > upper_outlier_thresholds_log[layer_number - data.length - 1]
												? upper_outlier_thresholds_log[layer_number - data.length - 1] * 1.2
												: value
									  )
									: data?.[layer_number - 1].map((value) =>
											value > upper_outlier_thresholds[layer_number - 1]
												? upper_outlier_thresholds[layer_number - 1] * 1.2
												: value
									  ),
								backgroundColor: "#04ff",
								borderColor: "#04f7",
								borderWidth: 0.2,
								pointBackgroundColor: !data
									? "#04f"
									: layer_number - data?.length > 0
									? data_log?.[layer_number - data.length - 1].map((value) =>
											value > upper_outlier_thresholds_log[layer_number - data.length - 1] ? "#88d" : "#04f"
									  )
									: data?.[layer_number - 1].map((value) =>
											value > upper_outlier_thresholds[layer_number - 1] ? "#88d" : "#04f"
									  ),
								pointRadius: 1.2,
							},
						],
					}}
					options={{
						chartArea: { backgroundColor: "#0044ff" },
						scales: {
							r: {
								legend: { display: false },
								min: 0,
								max: !data
									? 0
									: layer_number - data?.length > 0
									? Math.max(...upper_outlier_thresholds_log) * 1.3
									: upper_outlier_thresholds[layer_number - 1] * 1.5,
								stepSize: 0.05,
								ticks: {
									display: false,
									beginAtZero: true,
									color: "transparent",
								},
								pointLabels: { color: "#fff", font: { size: 12 } },
								grid: { color: "transparent" },
								angleLines: { color: "transparent" },
							},
						},
						plugins: {
							legend: { display: false },
							chartArea: { backgroundColor: "transparent" },
							tooltip: { enabled: false },
						},
						animations: {
							numbers: {
								properties: ["x", "y", "borderWidth", "radius", "tension"],
								duration: 500,
							},
						},
						responsive: true,
						aspectRatio: 1,
						maintainAspectRatio: false,
					}}
				/>
			</div>
			<div className='radial-activations-info'>
				<div className='radial-activations-info-text'>
					Layer {layer_number - data.length > 0 ? layer_number - data.length : layer_number}
				</div>
				<div className='radial-activations-tokens'>
					{tokens?.map((token, index) => (
						<span key={index} className={"radial-activations-token radial-activations-token-" + index}>
							{token}
						</span>
					))}
				</div>
				<div className='radial-activations-info-text'>
					{layer_number - data.length > 0
						? "Log | Upper Bound: " + Math.round(Math.max(...upper_outlier_thresholds_log) * 100) / 100
						: "Scale: " + Math.round((Math.max(...upper_outlier_thresholds) / upper_outlier_thresholds[layer_number - 1]) * 100) / 100}
				</div>
			</div>
			<div className='radial-activations-surrounding-circle-container'>
				<div className='radial-activations-surrounding-circle'></div>
				<div className='radial-activations-surrounding-circle-arrows'>
					<div className='radial-activations-surrounding-circle-arrow'></div>
					<div className='radial-activations-surrounding-circle-arrow'></div>
					<div className='radial-activations-surrounding-circle-arrow'></div>
					<div className='radial-activations-surrounding-circle-arrow'></div>
				</div>
			</div>
		</div>
	);
};
