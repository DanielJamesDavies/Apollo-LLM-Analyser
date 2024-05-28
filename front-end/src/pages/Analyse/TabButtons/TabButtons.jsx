// Packages
import { useEffect, useState } from "react";
import "chart.js/auto";
import { Radar } from "react-chartjs-2";

// Components

// Logic

// Context

// Services

// Styles
import "./Analyse.css";

// Assets

export const Analyse = () => {
	const [graph_data, setGraphData] = useState({
		labels: Array.from({ length: 2048 }, (index) => index),
		datasets: [
			{
				data: Array.from({ length: 2048 }, () => Math.random() * 12),
				backgroundColor: "#0044ff66",
				borderColor: "#0044ff",
				borderWidth: 0.1,
				pointBackgroundColor: "#0044ff",
				pointRadius: 0.8,
			},
		],
	});

	const [layer_number, setLayerNumber] = useState(1);

	useEffect(() => {
		const interval = setInterval(() => {
			setGraphData({
				labels: Array.from({ length: 2048 }, (index) => index),
				datasets: [
					{
						data: Array.from({ length: 2048 }, () => Math.random() * 12),
						backgroundColor: "#0044ff66",
						borderColor: "#0044ff",
						borderWidth: 0.1,
						pointBackgroundColor: "#0044ff",
						pointRadius: 0.8,
					},
				],
			});
			setLayerNumber((oldNum) => (oldNum >= 18 ? 1 : oldNum + 1));
		}, 1000);
		return () => clearInterval(interval);
	}, [setGraphData, setLayerNumber]);

	const graph_options = {
		scales: {
			r: {
				legend: {
					display: false,
				},
				min: 0,
				max: 12,
				stepSize: 1,
				ticks: {
					display: false,
					beginAtZero: true,
					color: "#444",
				},
				pointLabels: {
					color: "#fff",
					font: {
						size: 12,
					},
				},
				grid: false,
			},
		},
		plugins: {
			legend: {
				display: false,
			},
		},
		animations: {
			numbers: {
				properties: ["x", "y", "borderWidth", "radius", "tension"],
				duration: 750,
			},
		},
		responsive: true,
		aspectRatio: 1,
		maintainAspectRatio: false,
	};

	return (
		<div className='analyse-page'>
			<div className='analyse-subtitle'>Data</div>
			<div>Labels | User Prompts | System Prompts</div>
			<div>Collect Activations</div>
			<div className='analyse-subtitle'>Activations</div>
			<div className='analyse-charts'>
				<div className='analyse-chart-container'>
					<Radar className='analyse-chart' data={graph_data} options={graph_options} />
				</div>
				<div className='analyse-layer-number'>Layer {layer_number}</div>
			</div>
			<div>Activation Space</div>
			<div>Activations List</div>
			<div>View Activations</div>
			<div className='analyse-subtitle'>Analysis Models</div>
			<div>Analysis Models List</div>
			<div>Build Analysis Model (Model Name, Model Type, Labels, Layer, etc)</div>
		</div>
	);
};
