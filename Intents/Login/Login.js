import React from 'react';
import {Component} from 'react';
import {TextInput, StyleSheet, Image, View, Text, TouchableOpacity, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import * as firebase from "firebase";
import Icon from "react-native-vector-icons/Ionicons";

export default class Login extends Component{
    constructor(props) {
        super(props);
        this.state = {
           uname:'',
            pw:'',
            error:''
        };
    }

    componentDidMount() {


    }
    toSubmit = (e) =>{
       e.preventDefault()
        let c = false
        firebase.database().ref('users').on("value", (users)=>{
            users.forEach((user) => {
              if(user.val().username === this.state.uname && user.val().password === this.state.pwd){
                  c =true
                  if(user.val().type === 'SM'){
                      AsyncStorage.setItem('user_id', user.key)
                      this.props.navigation.navigate('Home')
                  }
                  else {
                      this.setState({error:'Only Site Mangers can log'})
                  }
              }
            });
        });

        if (!c)
            this.setState({error: 'Incorrect User Name and Password'})
    }
    render() {
        return (
            <View style={styles.container}>
                {/*<Icon*/}
                {/*    style={{ paddingLeft: 10 }}*/}
                {/*    onPress={() => this.props.navigation.openDrawer()}*/}
                {/*    name="md-menu"*/}
                {/*    size={30}*/}
                {/*/>*/}


                <Text style={{textAlign:'center', fontSize: 30,fontWeight:'bold', color:'lightskyblue',top:'5%'}}>Login</Text>
                <View style={{borderWidth:5, height:'70%', width:'80%', borderColor: 'lightskyblue', left:'10%',top:'10%'}}>
                    <Image style={{ width: 120, height: 120, marginLeft:'30%', borderWidth: 2, marginTop:'10%'}} source={require('../assets/main2.png')}/>

                    <Text style={styles.inputUn}>Username</Text>
                    <TextInput style={styles.input}
                               underlineColorAndroid="transparent"
                               autoCapitalize="none"
                               onChangeText={(text) => this.setState({uname:text})}/>


                    <Text style={styles.inputPw}>Password</Text>
                    <TextInput style={styles.input}
                               underlineColorAndroid="transparent"
                               autoCapitalize="none"
                               type='password'
                               secureTextEntry={true}
                               onChangeText={(text) => this.setState({pwd:text})}/>
                    <Text style={styles.errorMsg}>{this.state.error}</Text>

                    <TouchableOpacity
                        style={styles.submitButton}
                        onPress={
                            (e) => this.toSubmit(e)
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
        fontWeight: 'bold',
        fontSize: 17,
    },loginText: {
        fontWeight: 'bold',
        fontSize: 32,
        textAlign: 'center',
        fontFamily: 'sans-serif-condensed',
        paddingTop: 30,
    },
    inputUn: {
        textAlign: 'center',
        paddingTop: 20,
        fontSize: 17,
        marginTop:50,
        fontWeight: 'bold',
    },
    inputPw: {
        textAlign: 'center',
        paddingTop: 20,
        fontSize: 17,
        marginTop:10,
        fontWeight: 'bold',
    },
    input: {
        margin: 5,
        width: 220,
        height: 40,
        borderColor: '#000000',
        borderRadius: 10,
        textAlign: 'center',
        borderWidth: 1,
        backgroundColor:'white',
        left:'15%'

    },errorMsg: {
        color: '#800000',
        textAlign: 'center',
    },
})
