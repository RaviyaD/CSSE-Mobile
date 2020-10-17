import React from 'react';
import {Component} from 'react';
import {TextInput, StyleSheet, ScrollView, View, Text, TouchableOpacity, Button} from 'react-native';
import * as firebase from "firebase";
import Icon from "react-native-vector-icons/Ionicons";

export default class Item extends Component{
    constructor(props) {
        super(props);
        this.state = {
            item:'',
            itemList:[]
        };
    }

    componentDidMount() {
        firebase.database().ref('item').on("value", (items)=>{
            items.forEach((item) => {
                this.state.itemList.push(item.val());
                this.setState({
                    itemList:this.state.itemList
                });
                console.log(this.state.itemList)
            });
        });

    }
    toSubmit(){
        this.setState((state) => ({
            itemList:[]
        }));
        let item = {
            item: this.state.item
        };
        console.log('Came');
        firebase.database().ref('item').push(item)
            .then((res) => {
                console.log("Created new item successfully!");
                this.setState((state) => ({
                    item: '',
                    itemList:[]
                }));
                firebase.database().ref('item').on("value", (items)=>{
                    items.forEach((item) => {
                        this.state.itemList.push(item.val());
                        this.setState({
                            itemList:this.state.itemList
                        });
                        console.log(this.state.itemList)
                    });
                });
            })
            .catch((e) => {
                console.log(e);
            });

    }
    render() {
        return (
            <View style={styles.container}>
                <Icon
                    style={{ paddingLeft: 10 }}
                    onPress={() => this.props.navigation.openDrawer()}
                    name="md-menu"
                    size={30}
                />
                <Text style={{marginTop:'5%', marginLeft:'10%', fontSize: 30,fontWeight:'bold', color:'lightskyblue'}}>Items</Text>
                <View style={{borderWidth:2, height:'70%', width:'70%', margin:'10%', borderColor: 'lightskyblue'}}>

                    <Text style={{marginTop:'5%', marginLeft:'10%', fontSize: 20}}>Add Item</Text>
                    <TextInput style={styles.input}
                               underlineColorAndroid="transparent"
                               autoCapitalize="none"
                               placeholder="Enter new limit"
                               onChangeText={(text) => this.setState({item: text})}
                    />

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={
                            () => this.toSubmit()
                        }>
                        <Text style={styles.submitButtonText}> Submit </Text>
                    </TouchableOpacity>

                    <View style={{margin: '10%'}}>
                        {this.state.itemList.map(n => <Text>{n.item}</Text>)}
                    </View>


                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
        textAlign: 'center',
        backgroundColor:'white'
    },
    input: {
        //margin: 15,
        margin: '10%',
        width: 200,
        height: 40,
        borderColor: '#000000',
        borderRadius: 20,
        textAlign: 'center',
        borderWidth: 1,
    },
    submitButton: {
        backgroundColor: '#0093F6',
        padding: 10,
        marginLeft: '20%',
        marginTop:'15%',
        width: '60%',
        height: 40,
        borderRadius: 20,
    },
    submitButtonText: {
        textAlign: 'center',
        color: 'white',
    },
})
