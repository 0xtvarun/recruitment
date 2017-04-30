var socket = io.connect("https://floating-hamlet-25041.herokuapp.com/");

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			ips: []
		};
	}

	componentDidMount() {

		var instance = this;

		//On getting a single IP address
		socket.on('single-ip', function (data) {
			instance.setState(state => ({
				ips: state.ips.concat({ id: Date.now(), ip: data.ipaddr })
			}));
		});

		//On getting an array of IP address
		socket.on('array', function (data) {

			var newips = instance.state.ips = [];

			data.array.forEach(function (ip) {
				instance.state.ips.push({ id: new Date().getTime(), ip: ip });
			});

			instance.setState(state => ({
				ips: newips
			}));
		});

		//On disconnecting of a client
		socket.on('remove-single', function (data) {
			var ip = data.ipaddr;
			var newarray = this.state.ips;
			var index = newarray.indexOf(ip);
			newarray.splice(index, 1);
			instance.setState(state => ({
				ips: newarray
			}));
			instance.forceUpdate();
		});
	}

	render() {
		return React.createElement(
			'div',
			{ className: 'container-fluid' },
			React.createElement(SingleElement, { ips: this.state.ips })
		);
	}
}

class SingleElement extends React.Component {
	render() {
		return React.createElement(
			'div',
			null,
			this.props.ips.map(ip => React.createElement(
				'tr',
				null,
				React.createElement(
					'td',
					{ key: ip.id },
					ip.ip
				)
			))
		);
	}
}

ReactDOM.render(React.createElement(App, null), document.getElementById('root'));
