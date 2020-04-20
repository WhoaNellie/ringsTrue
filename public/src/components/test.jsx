class Header extends React.Component {
  render() {
    return (
      <div>
        <h1 className="page-header">{this.props.text}</h1>
      </div>
    );
  }
}
ReactDOM.render(
  <Header text="Dynamic Pie Chart" />,
  document.getElementById("app")
);
class Slider extends React.Component {
  render() {
    return (
      <div>
        <input
          type="range"
          min="1"
          max="100"
          onChange={this.props.sliderEvent}
        />
      </div>
    );
  }
}

var PropTypes = React.PropTypes;
var PieChart = React.createClass({
  displayName: "PieChart",
  propTypes: {
    className: PropTypes.string,
    size: PropTypes.number,
    slices: PropTypes.arrayOf(
      PropTypes.shape({
        color: PropTypes.string.isRequired, // hex color
        value: PropTypes.number.isRequired,
      })
    ).isRequired,
  },
  getDefaultProps: function getDefaultProps() {
    return {
      size: 200,
    };
  },

  _renderPaths: function _renderPaths() {
    var radCircumference = Math.PI * 2;
    var center = this.props.size / 2;
    var radius = center - 1; // padding to prevent clipping
    var total = this.props.slices.reduce(function (totalValue, slice) {
      return totalValue + slice.value;
    }, 0);

    var radSegment = 0;
    var lastX = radius;
    var lastY = 0;

    return this.props.slices.map(function (slice, index) {
      var color = slice.color;
      var value = slice.value;

      // Should we just draw a circle?
      if (value === total) {
        return React.createElement("circle", {
          r: radius,
          cx: radius,
          cy: radius,
          fill: color,
          key: index,
        });
      }

      if (value === 0) {
        return;
      }

      var valuePercentage = value / total;

      // Should the arc go the long way round?
      var longArc = valuePercentage <= 0.5 ? 0 : 1;

      radSegment += valuePercentage * radCircumference;
      var nextX = Math.cos(radSegment) * radius;
      var nextY = Math.sin(radSegment) * radius;

      // d is a string that describes the path of the slice.
      // The weirdly placed minus signs [eg, (-(lastY))] are due to the fact
      // that our calculations are for a graph with positive Y values going up,
      // but on the screen positive Y values go down.
      var d = [
        "M " + center + "," + center,
        "l " + lastX + "," + -lastY,
        "a" + radius + "," + radius,
        "0",
        "" + longArc + ",0",
        "" + (nextX - lastX) + "," + -(nextY - lastY),
        "z",
      ].join(" ");

      lastX = nextX;
      lastY = nextY;

      return React.createElement("path", { d: d, fill: color, key: index });
    });
  },

  /**
   * @return {Object}
   */
  render: function render() {
    var size = this.props.size;

    var center = size / 2;

    return React.createElement(
      "svg",
      { viewBox: "0 0 " + size + " " + size },
      React.createElement(
        "g",
        { transform: "rotate(-90 " + center + " " + center + ")" },
        this._renderPaths()
      )
    );
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slices: [
        { color: "#468966", value: 180 },
        { color: "#FFF0A5", value: 180 },
      ],
    };
    //this.handleSliderEvent = this.bind.handleSliderEvent(this);
  }
  handleSliderEvent(e) {
    var slices1 = (360 * e.target.value) / 100;
    var slices2 = 360 - slices1;
    var array1 = [
      { color: "#468966", value: slices1 },
      { color: "#FFF0A5", value: slices2 },
    ];
    console.log(array1);
    this.setState({ slices: array1 });
  }
  render() {
    return (
      <div>
        <Slider sliderEvent={this.handleSliderEvent.bind(this)} />
        <PieChart slices={this.state.slices} />
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById("pie_chart"));
