import React from 'react';
import {Component} from 'react';
import {TextInput, StyleSheet, ScrollView, View, Text, TouchableOpacity, Button} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';
import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';


class AddOrder extends Component {
    state = {
        supplierID: '',
        site: '',
        item: '',
        date: new Date(),
        description: '',
        show: false,

        companyIDError: '',
        supplierIDError: '',
        addressError: '',
        itemError: '',

        numberOrder: 0,
        numberDraft: 0,

        itemList: [],
        siteList: [],
        supList: [],
        supplierList: [],
        selectedItems: [{item: '', quantity: '',received:0}],
    };

    constructor() {
        super();
    }

    componentDidMount(): void {
        firebase.database().ref('Orders').on('value', (snapshot) => {
            this.setState({
                numberOrder: snapshot.numChildren(),
            });
        });

        firebase.database().ref('Draft').on('value', (snapshot) => {
            this.setState({
                numberDraft: snapshot.numChildren(),
            });
        });

        firebase.database().ref('item').on('value', (snapshot) => {
            snapshot.forEach((item) => {
                this.setState((state) => ({
                    itemList: [...state.itemList,
                        item.val().item,
                    ],
                }));
            });
        });

        firebase.database().ref('Sites').on('value', (snapshot) => {
            snapshot.forEach((item) => {
                this.setState((state) => ({
                    siteList: [...state.siteList, item.key],
                }));
            });
        });

        firebase.database().ref('suppliers').on('value', (snapshot) => {
            snapshot.forEach((item) => {
                this.setState((state) => ({
                    supList: [...state.supList, item.val()],
                }));
            });
        });
    }

    showDatePicker = () => {
        this.setState({
            show: true,
        });
    };

    validateSupplierID = () => {
        if (this.state.supplierID === '') {
            this.setState({
                supplierIDError: 'Select Supplier ID!',
            });
            return false;
        } else {
            this.setState({
                supplierIDError: '',
            });
            return true;
        }
    };

    validateAddress = () => {
        if (this.state.site === '') {
            this.setState({
                addressError: 'Site is required!',
            });
            return false;
        } else {
            this.setState({
                addressError: '',
            });
            return true;
        }
    };


    validateItem = () => {
        let result = false;
        this.state.selectedItems.map((item) => {
            if (item.item === '' || item.quantity === '') {
                this.setState({
                    itemError: 'Fill all the  items and quantity!',
                });
                result = false;
            } else {
                this.setState({
                    itemError: '',
                });
                result = true;
            }
        });
        return result

    };

    checkStatus = () => {
        let limit = 100000;
        let total = 0;
        let store = this.state.supplierID;
        let list = [];
        let sp = "";

        this.state.supList.map( t => {
            if (t.sname === store){
                list = t.itemList;
            }
        });

        this.state.selectedItems.map((object) => {
            let name = object.item;
            let quantity = object.quantity;

            list.map((i) => {
                if (i.item === name){
                    if (i.unit === undefined){
                        sp = "Hold";
                    }
                    total += parseInt(quantity) * parseInt(i.unit)
                }

            })
        });

        if (total < limit && sp === "Hold")
            return "Hold";
        if (total < limit)
            return "Approved";

        return "Pending";
    };

    toOrder = () => {
        let sID = this.validateSupplierID();
        let add = this.validateAddress();
        let it = this.validateItem();

        if (sID && add && it) {
            let status = this.checkStatus();
            let ID = this.generateOrderId();
            firebase.database().ref('Orders/' + ID).set({
                ID: ID,
                supplierID: this.state.supplierID,
                item: this.state.selectedItems,
                site: this.state.site,
                date: this.state.date.toString(),
                description: this.state.description,
                status: status,
            }).then(() => {
                console.log('Inserted');
                this.props.navigation.navigate('OrderList');
            }).catch(() => {
                console.log('Error');
            });
        }
    };

    toOrderDraft = () => {
        let ID = this.generateDraftId();
        firebase.database().ref('Draft/' + ID).set({
            supplierID: this.state.supplierID,
            item: this.state.selectedItems,
            site: this.state.site,
            date: this.state.date,
            description: this.state.description,
        }).then(() => {
            console.log(this.state.date);
            this.props.navigation.navigate('OrderList');
        }).catch(() => {
            console.log('Error');
        });
    };

    generateOrderId = () => {
        return 'ORD-' + (this.state.numberOrder + 1);
    };

    generateDraftId = () => {
        return 'DRF-' + (this.state.numberDraft + 1);
    };

    loadSupplier = () => {
        this.setState({
            supplierList: [],
        });
        let list = [];
        this.state.selectedItems.map((t) => {
            list = [...list, t.item];
        });
        this.state.supList.forEach((item) => {
            let array = [];

            item.itemList.forEach((block) => {
                array = [...array, block.item];
            });
            if (list.every(v => array.includes(v))) {
                this.setState((state) => ({
                    supplierList: [...state.supplierList, item.sname],
                }));
            }
        });
    };

    // handle click event of the Remove button
    handleRemoveClick = index => {
        const list = [...this.state.selectedItems];
        list.splice(index, 1);
        this.setState({
            selectedItems: list,
        }, () => {
            console.log(this.state.selectedItems);
        });
    };

    // handle click event of the Add button
    handleAddClick = () => {
        this.setState((state) => ({
            selectedItems: [...state.selectedItems, {item: '', quantity: '', received:0}],
        }));
    };


    render() {
        const {selectedItems} = this.state;

        return (
            <View style={styles.container}>
                <Icon
                    style={{paddingLeft: 10}}
                    onPress={() => this.props.navigation.openDrawer()}
                    name="md-menu"
                    size={30}
                />
                <ScrollView style={styles.scrollView}>
                    <Text style={styles.topic}>Add Order</Text>

                    <View style={{flexDirection: 'row'}}>
                        <View style={{flex: 1}}>
                            <Text style={styles.inputLabel}>Items</Text>
                        </View>
                        <View style={{flex: 1}}>
                            <TouchableOpacity
                                style={styles.plusButton}
                                onPress={
                                    () => this.handleAddClick()
                                }>
                                <Text style={styles.submitButtonText}> + </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {this.state.selectedItems.map((x, i) => {
                            return (
                                <View style={{flexDirection: 'row'}}>
                                    <View style={{flex: 1}}>
                                        <Picker
                                            selectedValue={x.item}
                                            style={{height: 50, width: 150}}
                                            onValueChange={(itemValue, itemIndex) => {
                                                this.setState(({selectedItems}) => ({
                                                    selectedItems: [
                                                        ...selectedItems.slice(0, i),
                                                        {
                                                            ...selectedItems[i],
                                                            item: itemValue,
                                                        },
                                                        ...selectedItems.slice(i + 1),
                                                    ],
                                                }), () => {
                                                    this.loadSupplier();
                                                    //console.log(this.state.selectedItems)
                                                });
                                            }
                                            }>
                                            <Picker.Item label="select one" value=""/>
                                            {this.state.itemList.map((item) => {

                                                return <Picker.Item label={item} value={item}/>;

                                            })}
                                        </Picker>
                                    </View>

                                    <View style={{flex: 1}}>

                                        <TextInput style={styles.inputQuantity}
                                                   placeholder="Quantity"
                                                   keyboardType='numeric'
                                                   underlineColorAndroid="transparent"
                                                   autoCapitalize="none"
                                                   onChangeText={(text) => {
                                                       this.setState(({selectedItems}) => ({
                                                           selectedItems: [
                                                               ...selectedItems.slice(0, i),
                                                               {
                                                                   ...selectedItems[i],
                                                                   quantity: text,
                                                               },
                                                               ...selectedItems.slice(i + 1),
                                                           ],
                                                       }), () => {
                                                           //console.log(this.state.selectedItems)
                                                       });
                                                   }
                                                   }
                                        />
                                    </View>
                                    <View style={{flex: 1, alignItems: 'center'}}>
                                        <TouchableOpacity
                                            style={styles.plusButton}
                                            onPress={() => {
                                                this.handleRemoveClick(i);
                                                this.loadSupplier();
                                            }
                                            }>
                                            <Text style={styles.submitButtonText}> - </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            );
                        },
                    )}
                    <Text style={styles.errorMsg}>{this.state.itemError}</Text>


                    <Text style={styles.inputLabel}>Supplier name</Text>
                    <Picker
                        selectedValue={this.state.supplierID}
                        style={{height: 50, width: 200}}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({supplierID: itemValue}, () => {
                                this.validateSupplierID();
                            });
                        }

                        }>
                        <Picker.Item label="select one" value=""/>
                        {this.state.supplierList.map((item) => (
                            <Picker.Item label={item} value={item}/>
                        ))}
                    </Picker>
                    <Text style={styles.errorMsg}>{this.state.supplierIDError}</Text>

                    <Text style={styles.inputLabel}>Site ID</Text>
                    <Picker
                        selectedValue={this.state.site}
                        style={{height: 50, width: 200}}
                        onValueChange={(itemValue, itemIndex) => {
                            this.setState({site: itemValue}, () => {
                                this.validateAddress();
                            });
                        }

                        }>
                        <Picker.Item label="select one" value=""/>
                        {this.state.siteList.map((site) => (
                            <Picker.Item label={site} value={site}/>
                        ))}
                    </Picker>
                    <Text style={styles.errorMsg}>{this.state.addressError}</Text>

                    <Text style={styles.inputLabel}>Date<Text
                        style={{fontWeight: 'bold'}}>  {this.state.date.toDateString()}</Text></Text>
                    <View style={styles.button}><Button style={styles.button} onPress={this.showDatePicker}
                                                        title="add Date"/></View>

                    {this.state.show && (<DateTimePicker
                        style={{width: 200}}
                        value={this.state.date}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={(event, date) => {
                            this.setState({date: date}, () => {
                                this.setState({
                                    show: false,
                                });
                            });
                        }}
                    />)}


                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput style={styles.input}
                               underlineColorAndroid="transparent"
                               autoCapitalize="none"
                               onChangeText={(text) => this.setState({description: text})}
                    />


                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={
                            () => this.toOrder()
                        }>
                        <Text style={styles.submitButtonText}> Submit </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={
                            () => this.toOrderDraft()
                        }>
                        <Text style={styles.submitButtonText}> Save draft </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        justifyContent: 'center',
        textAlign: 'center',
    },
    topic: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
    },
    loginText: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
        fontFamily: 'sans-serif-condensed',
        paddingTop: 30,
    },
    inputLabel: {
        marginLeft: 10,
        fontSize: 20,
        paddingTop: 25,
        fontWeight:'bold'
    },
    inputLabelQuantity: {
        marginLeft: 10,
        fontSize: 17,
    },
    errorMsg: {
        marginLeft: 15,
        color: '#800000',
    },
    input: {
        //margin: 15,
        margin: 5,
        width: 200,
        height: 40,
        borderColor: '#000000',
        borderRadius: 10,
        textAlign: 'center',
        borderWidth: 1,
    },
    inputQuantity: {
        margin: 5,
        width: 150,
        height: 40,
        textAlign: 'center',
        borderWidth: 2,
        borderColor: '#e5e9e6',
        borderRadius: 10,
    },
    submitButton: {
        backgroundColor: '#0093F6',
        padding: 10,
        margin: 15,
        width: '60%',
        height: 40,
    },
    plusButton: {
        backgroundColor: '#0093F6',
        padding: 5,
        margin: 15,
        height: 30,
        width: 30,
    },
    submitButtonText: {
        textAlign: 'center',
        color: 'white',
    },
    registerLink: {
        textAlign: 'center',
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    scrollView: {
        paddingTop: 20,
    },
    button: {
        width: '40%',
        marginLeft: 10,
    },
});

export default AddOrder;
