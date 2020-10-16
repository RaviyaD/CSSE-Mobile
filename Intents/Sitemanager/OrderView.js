import React from 'react';
import {Component} from 'react';
import {
    StyleSheet,
    View,
    Button, TouchableOpacity,
    Text, ScrollView, TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';

class OrderView extends Component {
    state = {
        key: this.props.route.params.key,
        data: {},
        list: [],
    };

    componentDidMount(): void {
        firebase.database().ref('/Orders/' + this.state.key).once('value', (snapshot) => {
            this.setState({
                data: snapshot.val(),
            }, () => {
                this.setState({
                    list: this.state.data.item,
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

    deleteOrder = () => {
        firebase.database().ref('/Orders/' + this.state.key).remove().then(r => {
            this.props.navigation.navigate('Home');
        });
    };

    editOrder = () => {
        this.props.navigation.navigate('UpdateOrder', {
            key: this.state.key,
        });
    };

    render() {
        const {data} = this.state;
        return (
            <View style={styles.container}>
                <Icon
                    style={{paddingLeft: 10}}
                    onPress={() => this.props.navigation.openDrawer()}
                    name="md-menu"
                    size={30}/>
                <Text style={styles.topic}>Order</Text>

                <Text style={styles.fieldName}>Order reference no</Text>
                <Text style={styles.fieldValue}>{this.state.key}</Text>

                <ScrollView>
                    <Text style={styles.fieldName}>Supplier Name</Text>
                    <Text style={styles.fieldValue}>{this.state.data.supplierID}</Text>

                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Text style={styles.fieldName}>Site name</Text>
                            <Text style={styles.fieldValue}>{this.state.data.site}</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <Text style={styles.fieldName}>Date ordered</Text>
                            <Text style={styles.fieldValue}>{new Date(this.state.data.date).toDateString()}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.fieldName}>Description</Text>
                        <Text style={styles.fieldValue}>{this.state.data.description}</Text>
                    </View>

                    <Text style={styles.fieldName}>Status of the order</Text>
                    <Text style={styles.fieldValue}>{this.state.data.status}</Text>

                    <View>
                        <Text style={styles.fieldName}>Items ordered.</Text>
                        {
                            this.state.list.map((i, index) => (
                                    <View>
                                        <View style={{flexDirection: 'row'}}>
                                            <View style={{flex: 1}}>
                                                <Text style={styles.fieldValue}>{index + 1}. {i.item}</Text>
                                            </View>

                                            <View style={{flex: 1}}>
                                                <Text style={styles.fieldValue}>Quantity : {i.quantity}</Text>
                                            </View>
                                        </View>
                                    </View>
                                ),
                            )
                        }
                    </View>

                    <View style={{flexDirection: 'row',marginTop:30}}>
                        <View style={{flex: 1}}>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={() => this.editOrder()}
                            >
                                <Text style={styles.submitButtonText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex: 1}}>
                            <TouchableOpacity
                                style={styles.submitButton}
                                onPress={() => this.deleteOrder()}
                                //underlayColor='#fff'
                            >
                                <Text style={styles.submitButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>


                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        textAlign: 'center',
    },
    topic: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#0093F6',
        padding: 10,
        width: '50%',
        height: 40,
    },
    submitButtonText: {
        textAlign: 'center',
        color: 'white',
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
});
export default OrderView;
