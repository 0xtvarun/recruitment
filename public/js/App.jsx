var socket = io.connect("http://192.168.1.5:3000");

class App extends React.Component{

	constructor(props) {
		super(props);
		this.state = {
			ips: []
		};
	}

	componentDidMount() {

		var instance = this;

		//On getting a single IP address
		socket.on('single-ip', function(data){
			instance.setState((state) => ({
				ips: state.ips.concat({id: Date.now(), ip: data.ipaddr})
			}));
		});

		//On getting an array of IP address
		socket.on('array', function(data){

			var newips = instance.state.ips = [];

			data.array.forEach(function(ip){
				instance.state.ips.push({id: new Date().getTime(), ip: ip});
			});

			instance.setState((state) => ({
				ips: newips
			}));
		});

		//On disconnecting of a client
		socket.on('remove-single', function(data){
			var ip = data.ipaddr;
			var newarray = instance.state.ips;
			var index = newarray.indexOf(ip);
			newarray.splice(index, 1);
			console.log(newarray);
			instance.setState((state) => ({
				ips: newarray
			}))
			instance.forceUpdate();
		});
	}

	render(){
		return(
			<div className="container-fluid">
				<SingleElement ips={this.state.ips} />
			</div>
		);
	}
}

class SingleElement extends React.Component {
	render(){
		return(
			<div>
			{this.props.ips.map( ip => (
				<tr>
					<td key={ip.id}>{ip.ip}</td>
				</tr>
			))}
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
