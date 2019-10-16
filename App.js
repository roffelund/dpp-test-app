import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Linking,
} from 'react-native';

import WebView from 'react-native-webview';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import logo from './logo-slim.png';
import {parse} from 'react-native-rss-parser';
import moment from 'moment';

const formatDate = date => moment(date).format('YYYY-MM-DD HH:mm:ss');

const getRssFeed = async url => {
  const response = await fetch(url);

  const date = response.headers.map.date;
  const formattedDate = formatDate(date);

  const responseData = await response.text();
  const parsedData = await parse(responseData);
  const items = parsedData.items;

  return {items, date: formattedDate.toString()};
};

const itemStyle = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'blue',
    backgroundColor: Colors.lighter,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  description: {
    marginTop: 8,
    fontSize: 12,
    color: Colors.black,
  },
});

const handleOpenUrl = url => {
  Linking.openURL(url).catch(error => console.error(error));
};

// const renderItem = (item, index) => {
//   const {id, title, description} = item;
//   let {published} = item;
//   published = formatDate(published);
//   const key = `${index}${id}`;

//   return (
//     <TouchableOpacity
//       onPress={() => handleOpenUrl(id)}
//       key={key}
//       style={itemStyle.wrapper}>
//       <Text style={itemStyle.title}>{title}</Text>
//       <Text>{published}</Text>
//       <Text style={itemStyle.title}>{description}</Text>
//     </TouchableOpacity>
//   );
// };

class App extends React.Component {
  state = {
    items: [],
    fetchedAt: null,
    xprItems: [],
    xprFetchedAt: null,
    brand: 'dn',
  };
  componentDidMount() {
    this.updateRss();
  }
  renderItem = (item, index) => {
    const {brand} = this.state;
    const {id, title, description} = item;
    console.log(item);
    console.log('banana');
    let {published} = item;
    published = formatDate(published);
    const key = `${index}${id}`;

    return (
      <TouchableOpacity
        onPress={() => handleOpenUrl(id)}
        key={key}
        style={itemStyle.wrapper}>
        <Text style={itemStyle.title}>{title}</Text>
        <Text>{published}</Text>
        <Text style={itemStyle.title}>{description}</Text>

        {/* {brand === 'dn' ? (
          <Text style={itemStyle.title}>{description}</Text>
        ) : (
          <WebView originWhitelist={['*']} source={{html: description}} />
        )} */}
      </TouchableOpacity>
    );
  };
  updateRss = async () => {
    const dnflow = await getRssFeed('https://www.dn.se/rss');
    const xprFlow = await getRssFeed('https://feeds.expressen.se/nyheter/');
    this.setState({
      items: dnflow.items,
      fetchedAt: dnflow.date,
      xprItems: xprFlow.items,
      xprFetchedAt: xprFlow.date,
    });
  };

  toggleBrand = brandName => {
    this.setState({brand: brandName});
  };

  render() {
    const {items, fetchedAt, xprItems, xprFetchedAt, brand} = this.state;

    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View style={styles.body}>
              <View style={styles.imageWrapper}>
                <Image source={logo} />
              </View>
              <TouchableOpacity style={styles.button} onPress={this.updateRss}>
                <Text style={styles.buttonText}>Uppdatera</Text>
                <Text>
                  Senast hämtat: {brand === 'dn' ? fetchedAt : xprFetchedAt}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.toggleBrand('dn')}>
                <Text style={styles.buttonText}>Dagens Nyheter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.toggleBrand('expressen')}>
                <Text style={styles.buttonText}>Expressen</Text>
              </TouchableOpacity>
              {/* Map over all items if any are available */}
              {brand === 'dn'
                ? items.map(this.renderItem)
                : xprItems.map(this.renderItem)}
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: 'pink',
    flex: 1,
  },
  button: {
    margin: 20,
    height: 40,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  imageWrapper: {
    backgroundColor: 'white',
    padding: 20,
  },
});

export default App;
