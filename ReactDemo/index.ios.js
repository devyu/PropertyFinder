'use strict';

var React = require('react-native');
var SearchPage = require('./SearchPage');

var styles = React.StyleSheet.create ({
  text: {
    color: 'black',
    fontSize: 50,
  },
  container: {
    flex: 1,
  },
});

class HelloWorld extends React.Component {
  render() {
    return <React.Text style={styles.text}>Hello World(Again)</React.Text>;
  }
}

class ReactDemo extends React.Component {
  render() {
    // 构建一个导航栏, 并设置为初始的路由为 ReactDemo 组件,在 web 开发当中, 路由是一种定义应用导航的一种技术,即定义页面与路由之间的映射关系
    return (
      <React.NavigatorIOS style={styles.container}
      initialRoute={{
        title: 'Property Finder',
        // component: HelloWorld, // 导航栏的这个组件是由 HelloWorld 组件构成.
        component: SearchPage,
      }}/>
    );
  }
}

React.AppRegistry.registerComponent('ReactDemo', function() { return ReactDemo });
