import React from 'react';
import {Component} from 'react';
import {StyleSheet, View, Button, FlatList, Text, ScrollView, TextInput, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';

class returnView extends Component {
    state = {
        key: this.props.route.params.key,
        data: {},
        list: [],
        listUpdated: [],
        logDate: [],
        logList: [],
    };

    componentDidMount(): void {
        firebase.database().ref('/Orders/' + this.state.key).once('value', (snapshot) => {
            this.setState({
                data: snapshot.val(),
            }, () => {
                this.setState({
                    list: this.state.data.item,
                    listUpdated: this.state.data.item,
                    logList: this.state.data.logList,
                }, t => {
                    console.log(this.state.list);
                });
            });


        });

    }

    componentWillReceiveProps(props): void {
        this.setState({
            key: props.route.params.key,
        }, () => {
            this.componentDidMount();
        });
    }

    updateLog = () => {

        let log = [];
        let previous = [];
        this.state.listUpdated.map((item, i) => {
            if (item.received - this.state.list[i].received !== 0 && !isNaN(item.received)) {
                log = [...log, {
                    item: item.item,
                    quantityReceived: item.received - this.state.list[i].received,
                }];
            }
        });
        if (this.state.logList !== undefined) {
            previous = this.state.logList;
        }

        if (log.length > 0) {
            firebase.database().ref('Orders/' + this.state.key).update({
                item: this.state.listUpdated,
                logList: [...previous, {
                    date: new Date(),
                    history: log,
                }],
            }).then(() => {
                console.log('Updated');
                this.props.navigation.navigate('Home');
            }).catch(() => {
                console.log('Error');
            });
        } else {
            this.props.navigation.navigate('Home');
        }

    };

    render() {
        return (
            <View>
                <Icon
                    style={styles.icon}
                    onPress={() => this.props.navigation.openDrawer()}
                    name="md-menu"
                    size={30}/>
                <View style={styles.container}>
                    <Text style={styles.topic}>Receiving Items</Text>
                    <Text style={styles.fieldName}>Order reference no</Text>
                    <Text style={styles.fieldValue}>{this.state.key}</Text>

                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Text style={styles.fieldName}>Site name</Text>
                            <Text style={styles.fieldValue}>{this.state.data.site}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.fieldName}>Date</Text>
                            <Text style={styles.fieldValue}>{new Date(this.state.data.date).toDateString()}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.fieldName}>Description</Text>
                        <Text style={styles.fieldValue}>{this.state.data.description}</Text>
                    </View>

                    <View>
                        <Text style={styles.fieldName}>Items ordered.</Text>
                        {
                            this.state.list.map((i, index) => (
                                    <View>
                                        <Text style={styles.itemValue}>{index + 1}. {i.item}</Text>
                                        <View style={{flexDirection: 'row'}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.quantityValue}>Quantity : {i.quantity}</Text>
                                            </View>

                                            <View style={{flex: 1}}>
                                                <Text>Received Quantity {i.received}</Text>
                                                <TextInput
                                                    defaultValue={0}
                                                    style={styles.inputField}
                                                    placeholder="Quantity receiving.."
                                                    keyboardType='numeric'
                                                    underlineColorAndroid="transparent"
                                                    autoCapitalize="none"
                                                    onChangeText={(text) => {
                                                        this.setState(({listUpdated, list}) => ({
                                                            listUpdated: [
                                                                ...listUpdated.slice(0, index),
                                                                {
                                                                    ...listUpdated[index],
                                                                    received: parseInt(text) + list[index].received,
                                                                },
                                                                ...listUpdated.slice(index + 1),
                                                            ],
                                                        }), () => {
                                                            console.log(this.state.listUpdated);
                                                        });
                                                    }
                                                    }
                                                />
                                            </View>
                                        </View>
                                    </View>
                                ),
                            )
                        }
                    </View>


                    <View style={{alignItems: 'center'}}>
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() => {
                                this.updateLog();
                            }
                            }>
                            <Text style={styles.submitButtonText}> Received </Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        textAlign: 'center',
    },
    icon: {
        padding: 10,
        fontWeight: 'bold',
    },
    fieldName: {
        marginTop: 20,
        fontWeight: 'bold',
        fontSize: 20,
        color: '#581845',
    },
    fieldValue: {
        fontSize: 20,
    },
    itemValue: {
        fontSize: 18,
    },
    quantityValue: {
        marginLeft: 10,
        padding: 11,
        fontSize: 16,
    },
    inputField: {
        borderWidth: 1,
        height: 40,
        borderRadius: 10,
        borderColor: 'black',
    },
    submitButton: {
        backgroundColor: '#0093F6',
        padding: 10,
        margin: 15,
        width: '60%',
        height: 40,
    },
    submitButtonText: {
        textAlign: 'center',
        color: 'white',
    },
    topic: {
        fontSize:28,
        fontWeight:'bold'
    }
});
export default returnView;
