import React from 'react';
import {Component} from 'react';
import {StyleSheet, View, Button, FlatList, Text, ScrollView} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';
import {ListItem} from 'react-native-elements';

class DraftList extends Component {
    state = {
        orderList: [],
    };

    componentDidMount(): void {
        firebase.database().ref('Draft').on('value', (snapshot) => {
            snapshot.forEach((item) => {
                let element = {
                    key: item.key,
                    title: item.key,
                    data: item.val(),
                };
                this.setState((state) => ({
                    orderList: [...state.orderList, element]
                }));
            });
        })
    }

    toView = (key) => {
        this.props.navigation.navigate('UseDraft', {
            key: key,
        });
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
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.topic}>Draft List</Text>
                    <FlatList
                        style={styles.list}
                        data={this.state.orderList}
                        renderItem={({ item }) => (
                            <ListItem
                                roundAvatar
                                title={`${item.key}`}
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

export default DraftList;
