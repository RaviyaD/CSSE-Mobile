import React from 'react';
import {Component} from 'react';
import {View, Button, FlatList, Text, ScrollView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';
import { SearchBar,ListItem } from 'react-native-elements';

class Home extends Component{
    state = {
        search:'',
        orderList:[],
        flatList:[]
    };
     componentDidMount(): void {



        firebase.database().ref('Orders').orderByChild('status').equalTo('Placed')
            .on('value',snapshot => {
                this.setState({
                    orderList: []
                });
                snapshot.forEach((item) => {
                    let element = {
                        key: item.key,
                        title: item.key,
                        data: item.val(),
                    };
                    this.setState((state) => ({
                        orderList: [...state.orderList, element],
                        flatList: [...state.orderList, element]
                    }));
                });
        })
    }

    updateSearch = (search) => {
        this.setState({ search });
        const newData = this.state.orderList.filter(item => {
            const itemData = item.key.toUpperCase();
            const textData = search.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });
        this.setState({
            flatList: newData,
        });
    };

    toView = (key) => {
        console.log(key+"press");
        this.props.navigation.navigate('returnView', {
            key: key,
        });
    };

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: '86%',
                    backgroundColor: '#CED0CE',
                    marginLeft: '14%',
                }}
            />
        );
    };

    render(){
        const { search } = this.state;


        return(
            <View>
                <Icon
                    style={styles.icon}
                    onPress={() => this.props.navigation.openDrawer()}
                    name="md-menu"
                    size={30}
                />

                <Icon
                    style={{ right: 20,position:'absolute' }}
                    onPress={() => {AsyncStorage.setItem('user_id', null)
                        this.props.navigation.navigate('Login')}}
                    name="log-out"
                    size={30}
                />
                <View style={styles.container}>
                    <Text style={styles.viewTopic}>Logging Details</Text>
                </View>

                <View style={{width:'80%',alignSelf:'center'}}>
                    <SearchBar
                        containerStyle={{backgroundColor:'transparent',borderBottomColor:'white',borderTopColor:'white'}}
                        placeholder="Type Here..."
                        onChangeText={this.updateSearch}
                        round
                        value={search}
                    />
                </View>
                <View style={{margin:10}}>
                    <View containerStyle={{ borderTopWidth: 0, borderBottomWidth: 0 }}>
                        <FlatList
                            data={this.state.flatList}
                            renderItem={({ item }) => (
                                <ListItem
                                    roundAvatar
                                    title={`${item.data.ID} - ${item.data.site}`}
                                    subtitle={item.data.supplierID}
                                    containerStyle={{ borderBottomWidth: 0 }}
                                    onPress={() => {
                                        this.toView(item.data.ID)
                                    }}
                                />
                            )}
                            keyExtractor={item => item.key}
                            ItemSeparatorComponent={this.renderSeparator}
                        />
                    </View>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        textAlign: 'center',
    },
    icon: {
        padding:10,
        fontWeight:'bold'
    },
    viewTopic: {
        fontWeight: 'bold',
        fontSize:25
    },

});
export default Home
