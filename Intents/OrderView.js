import React from 'react';
import {Component} from 'react';
import {
    StyleSheet,
    View,
    Button, TouchableOpacity,
    Text
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase';

class OrderView extends Component{
    state = {
        key:this.props.route.params.key,
        data:{}
    };

    componentDidMount(): void {
        firebase.database().ref('/Orders/' + this.state.key).once('value',(snapshot)=>{
            this.setState({
                data:snapshot.val()
            })
        });

    }

    componentWillReceiveProps(props): void {
        this.setState({
            key:props.route.params.key
        }, () =>{
            this.componentDidMount()
        })
    }

    deleteOrder = () => {
        firebase.database().ref('/Orders/' + this.state.key).remove().then(r => {
            this.props.navigation.navigate('Home')
        })
    };

    editOrder = () => {
        this.props.navigation.navigate('UpdateOrder', {
            key: this.state.key,
        });
    };

    render(){
        return(
            <View style={styles.container}>
                <Icon
                    style={{ paddingLeft: 10 }}
                    onPress={() => this.props.navigation.openDrawer()}
                    name="md-menu"
                    size={30}/>
                <Text style={styles.topic}>Order view</Text>
                <Text style={styles.textCommon}>Order No : <Text> {this.state.key}</Text></Text>
                <Text style={styles.textCommon}>Company :<Text> {this.state.data.companyID}</Text></Text>
                <Text style={styles.textCommon}>Supplier :<Text> {this.state.data.supplierID}</Text></Text>
                <Text style={styles.textCommon}>Item :<Text> {this.state.data.item}</Text></Text>
                <Text style={styles.textCommon}>Address :<Text> {this.state.data.addressNo+", "+this.state.data.addressRoad+", "+this.state.data.addressCity}</Text></Text>
                <Text style={styles.textCommon}>Date :<Text> {this.state.data.date}</Text></Text>
                <Text style={styles.textCommon}>Quantity :<Text> {this.state.data.quantity}</Text></Text>
                <Text style={styles.textCommon}>Description :<Text> {this.state.data.description}</Text></Text>
                <Text style={styles.textCommon}>Price Per Unit :<Text> {this.state.data.pricePerUnit}</Text></Text>
                <Text style={styles.textCommon}>Status :<Text> {this.state.data.status}</Text></Text>
                <TouchableOpacity
                    style={styles.editButtonCommon}
                    onPress={() => this.editOrder()}
                    >
                    <Text style={styles.loginText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButtonCommon}
                    onPress={() => this.deleteOrder()}
                    //underlayColor='#fff'
                >
                    <Text style={styles.loginText}>Delete</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
        textAlign: 'center',
    },
    topic: {
        fontWeight: 'bold',
        fontSize: 30,
        textAlign: 'center',
        paddingBottom: 20
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
    editButtonCommon: {
        alignSelf:'center',
        backgroundColor: '#FFF5A2',
        width: '50%',
        marginTop:10,
        padding:6,
        borderRadius: 10
    },
    deleteButtonCommon: {
        alignSelf:'center',
        backgroundColor: '#FFD3D3',
        width: '50%',
        marginTop:10,
        padding:6,
        borderRadius: 10
    },
    buttonText: {
        textAlign: 'center',
        color: 'white',
    },
    scrollView: {
        paddingTop: 20,
    },
    textCommon:{
        paddingLeft:20,
        fontSize: 20
    },
    loginText: {
        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'sans-serif-condensed',
    },
});
export default OrderView
