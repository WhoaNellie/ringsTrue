import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';

function App() {
	const [rangeState, setRangeState] = useState({
		accuracy: 50,
		neutrality: 50,
	});
	const [chartState, setChartState] = useState({
		datasets: [
			{
				label: 'Accuracy',
				data: [rangeState.accuracy, 100 - rangeState.accuracy],
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
		if (chart === 'accuracy') {
			setChartState({
				datasets: [
					{
						label: 'Accuracy',
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
						label: 'Accuracy',
						data: [rangeState.accuracy, 100 - rangeState.accuracy],
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
			<label htmlFor="accuracy">Accuracy</label>
			<input
				id="accuracy"
				name="accuracy"
				type="range"
				min="0"
				max="100"
				value={rangeState.accuracy}
				onChange={(event) => handleRange(event, 'accuracy')}
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