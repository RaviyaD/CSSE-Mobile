import React from 'react';
import {Component} from 'react';
import {StyleSheet, View, Button, FlatList, Text, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';
import {ListItem} from 'react-native-elements';

class OrderList extends Component {
    state = {
        orderList: [],
    };

    componentDidMount(): void {
        firebase.database().ref('Orders').on('value', (snapshot) => {
            this.setState({
                orderList: []
            })
            snapshot.forEach((item) => {
                let element = {
                    key: item.key,
                    title: item.key,
                    data: item.val(),
                };
                this.setState((state) => ({
                    orderList: [...state.orderList, element]
                }));
                console.log(item.key)
            });
        })
    }

    toView = (key) => {
        console.log(key+"press");
        this.props.navigation.navigate('OrderView', {
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


    render() {

        return (
            <View styles={styles.container}>
                <Icon
                    style={styles.icon}
                    onPress={() => this.props.navigation.openDrawer()}
                    name="md-menu"
                    size={30}
                />
                <View style={styles.addOrder}>
                    <Button title="Add Order" onPress={() => this.props.navigation.navigate('AddOrder')}/>
                </View>
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.topic}>Order List</Text>
                    <FlatList
                        nestedScrollEnabled={true}
                        style={styles.list}
                        data={this.state.orderList}
                        renderItem={({ item }) => (
                            <ListItem
                                roundAvatar
                                title={`${item.data.ID} - ${item.data.site}`}
                                subtitle={item.data.supplierID}
                                containerStyle={{ borderBottomWidth: 0 }}
                                onPress={() => {
                                    this.toView(item.key)
                                }}
                                ItemSeparatorComponent={this.renderSeparator}
                            />
                        )}
                        keyExtractor={item => item.key}
                    />
                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    item: {
        padding: 4,
        backgroundColor: '#f4f0ec',
        marginVertical: 4,
        marginHorizontal: 5,
    },
    title: {
        fontSize: 25,
    },
    list: {
        marginTop: 10,
    },
    addOrder: {
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight:10
    },
    icon: {
        padding:10,
        fontWeight:'bold'
    },
    listIcon: {
        marginLeft:20,
        fontWeight:'bold'
    },
    topic: {
        fontWeight: 'bold',
        fontSize: 25
    },
    scrollView: {
        paddingLeft:10
    }
});

export default OrderList;
