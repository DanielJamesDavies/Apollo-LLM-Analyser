// Packages
import ReactSlider from "react-slider";

// Components

// Logic

// Context

// Services

// Styles
import "./MinMaxRangeSlider.css";

// Assets

export const MinMaxRangeSlider = ({ min_value = 30, max_value = 70, min_end = 0, max_end = 100, onChange }) => {
	return (
		<div className='min-max-range-slider-container'>
			<ReactSlider
				className='min-max-range-slider'
				thumbClassName='min-max-range-slider-thumb'
				trackClassName='min-max-range-slider-track'
				defaultValue={[min_value, max_value]}
				min={min_end}
				max={max_end}
				ariaLabel={["Lower thumb", "Upper thumb"]}
				ariaValuetext={(state) => `Thumb value ${state.valueNow}`}
				pearling
				minDistance={1}
				onChange={onChange}
			/>
		</div>
	);
};
