import React from 'react';
import {Component} from 'react';
import {TextInput, StyleSheet, ScrollView, View, Text, TouchableOpacity, Button} from 'react-native';
import * as firebase from "firebase";
import Icon from "react-native-vector-icons/Ionicons";

export default class Limit extends Component{
    state = {
        climit:'',
        limit:''
    };
    componentDidMount() {
        firebase.database().ref('limit').on("value", (items)=>{
            items.forEach((item) => {
                this.setState({
                    climit:item.val().limit
                });
            });
        });

    }
    toSubmit(){
            let limit = {
                limit: this.state.limit
            };
            console.log('Came');
            firebase.database().ref('limit').push(limit)
                .then((res) => {
                    console.log("Created new limit successfully!");
                    console.log(res);
                    this.setState({
                        limit: '',
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
                    <Text style={{marginTop:'5%', marginLeft:'10%', fontSize: 30,fontWeight:'bold', color:'lightskyblue'}}>Update Current Limit</Text>
                <View style={{borderWidth:2, height:'70%', width:'70%', margin:'10%', borderColor: 'lightskyblue'}}>
                    <Text style={{marginTop:'5%', marginLeft:'10%', fontSize: 20}}>Current Limit</Text>
                    <TextInput style={styles.input}
                               underlineColorAndroid="transparent"
                               autoCapitalize="none"
                               placeholder={this.state.climit}
                               editable={false} selectTextOnFocus={false}
                               />

                <Text style={{marginTop:'5%', marginLeft:'10%', fontSize: 20}}>Set new Limit</Text>
                <TextInput style={styles.input}
                           underlineColorAndroid="transparent"
                           autoCapitalize="none"
                           placeholder="Enter new limit"
                           onChangeText={(text) => this.setState({limit: text})}
                />

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={
                        () => this.toSubmit()
                    }>
                    <Text style={styles.submitButtonText}> Submit </Text>
                </TouchableOpacity>

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
