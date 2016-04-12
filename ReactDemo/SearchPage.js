
'use strict';

var React = require("react-native")
var {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicatorIOS,
  Image,
  Component,
} = React;

var SearchResults = require('./SearchResults.js');

function urlForQueryAndPage(key, value, pageNumber) {
  var data = {
    country: 'uk',
    pretty: '1',
    encoding: 'json',
    listing_type: 'buy',
    action: 'search_listings',
    page: pageNumber
  };
  data[key] = value;

  var querystring = Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');

  return 'http://api.nestoria.co.uk/api?' + querystring;
}



class SearchPage extends Component {

  // set initial state: each React component has its own state object
  constructor(props) {
    super(props);
    this.state = {
      searchString: 'london',
      isLoading: false, // keep track query state
      message: '',
    };
  }

  // search event
  onSearchTextChanged(event) {
    console.log('onSearchTextChanged');
    this.setState({searchString: event.nativeEvent.text});
    console.log(this.state.searchString);
  }

  // executive query
  _executeQuery(query) {
    console.log(query);
    this.setState({isLoading: true});

    fetch(query)
    .then(response => response.json())
    .then(json => this._handleResponse(json.response))
    .catch(error =>
      this.setState({
        isLoading: false,
        message: 'Something bad happend ' + error
      }));
  }

    _handleResponse(response) {
      this.setState({ isLoading: false , message: '' });
      if (response.application_response_code.substr(0, 1) === '1') {
        this.props.navigator.push({
          title: 'Results',
          component: SearchResults,
          passProps: {listings: response.listings}
        });
      } else {
        this.setState({ message: 'Location not recognized; please try again.'});
      }
    }


  onSearchPressed() {
    var query = urlForQueryAndPage('place_name', this.state.searchString, 1);
    // js 并没有私有修饰符, 因此使用'_'变量表示私有方法.
    this._executeQuery(query);
  }

  // press location
  onLocationPressed() {
    navigator.geolocation.getCurrentPosition(
        location => {
          var search = location.coords.latitude + ',' + location.coords.longitude;
          this.setState({ searchString: search });
          var query = urlForQueryAndPage('centre_point', search, 1);
          this._executeQuery(query);
        },
        error => {
          this.setState({
            message: 'There was a problem with obtaining your location: ' + error
          });
        });
  }

  render() {
    {/* loading state, */}
    var spinner = this.state.isLoading ?
    (<ActivityIndicatorIOS size='large' />) : (<View />);

    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Search Me!
        </Text>
        <Text style={styles.description}>
          Search by place-name, postcode or search near your location.
        </Text>

{
  /* 在布局的过程中,不需要显示定义两个组件的宽度,只要将组件放在两个容器当中,定义 flexDirection:'row',在定义两者宽度比为 4:1
  */
}
        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this.onSearchTextChanged.bind(this)}
            placeholder='Search via name or postcode'
          />
          <TouchableHighlight style={styles.button} underlayColor='#99d9f4' onPress={this.onSearchPressed.bind(this)}>
            <Text style={styles.buttonText}>GO</Text>
          </TouchableHighlight>
        </View>

        <TouchableHighlight style={styles.button} underlayColor='#99d9f4'>
          <Text style={styles.buttonText} onPress={this.onLocationPressed.bind(this)}>Location</Text>
        </TouchableHighlight>

        <Image source={require('./Resources/house.png')} style={styles.image}/>
        {spinner}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }
}


var styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565',
  },
  container: {
    padding: 30, // 上下左右的内边距
    marginTop: 65,
    alignItems: 'center',
  },
  flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    // backgroundColor: 'red'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC',
  },
  button: {
    height: 36,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
  },
  image: {
    width: 217,
    height: 138,
  },
});

// export SeatchPage 类,提供给其他模块使用
module.exports = SearchPage;
