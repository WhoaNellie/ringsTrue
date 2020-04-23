import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

function App() {
	const [rangeState, setRangeState] = useState({
		information: 50,
		neutrality: 50,
	});
	const [chartState, setChartState] = useState({
		datasets: [
			{
				label: 'Information',
				data: [rangeState.information, 100 - rangeState.information],
				backgroundColor: ['#629C44', '#FFFFFF'],
			},
			{
				label: 'Neutrality',
				data: [rangeState.neutrality, 100 - rangeState.neutrality],
				backgroundColor: ['#633B8E', '#FFFFFF'],
			},
		],
	});
	const options = {
		events: [],
		tooltips: { enabled: false },
		hover: { mode: null },
	};

	function handleRange(e, chart) {
		setRangeState({ ...rangeState, [chart]: e.target.value });
		if (chart === 'information') {
			setChartState({
				datasets: [
					{
						label: 'Information',
						data: [e.target.value, 100 - e.target.value],
						backgroundColor: ['#629C44', '#FFFFFF'],
					},
					{
						label: 'Neutrality',
						data: [rangeState.neutrality, 100 - rangeState.neutrality],
						backgroundColor: ['#633B8E', '#FFFFFF'],
					},
				],
			});
		} else if (chart === 'neutrality') {
			setChartState({
				datasets: [
					{
						label: 'Information',
						data: [rangeState.information, 100 - rangeState.information],
						backgroundColor: ['#629C44', '#FFFFFF'],
					},
					{
						label: 'Neutrality',
						data: [e.target.value, 100 - e.target.value],
						backgroundColor: ['#633B8E', '#FFFFFF'],
					},
				],
			});
		}
	} // handleRange end--

	return (
		<aside className="modal rating">
			<Doughnut data={chartState} options={options} />​
			<label htmlFor="information">Information</label>
			<input
				id="information"
				name="information"
				type="range"
				min="0"
				max="100"
				value={rangeState.information}
				onChange={(event) => handleRange(event, 'information')}
			/>
			​<label htmlFor="neutrality">Neutrality</label>
			<input
				id="neutrality"
				name="neutrality"
				type="range"
				min="0"
				max="100"
				value={rangeState.neutrality}
				onChange={(event) => handleRange(event, 'neutrality')}
			/>
			​
		</aside>
	);
}

export default App;