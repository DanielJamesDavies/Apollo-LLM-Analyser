// Packages

// Components

// Logic

// Context

// Services

// Styles
import "./AnalysisModels.css";

// Assets

export const AnalysisModels = () => {
	return (
		<div className='analyse-page-subpage analyse-page-analysis-models'>
			<div>Analysis Models List</div>
			<br />
			<div>Build Analysis Models (Model Name, Model Type, Labels, Layer, etc)</div>
			<br />
			<div>Model Types:</div>
			<ul>
				<li>Logistic Regression Models</li>
				<li>SVMs</li>
				<li>SOMs</li>
				<li>t-SNE</li>
				<li>Dictionary Learning Models</li>
				<li>Transformers</li>
			</ul>
		</div>
	);
};
