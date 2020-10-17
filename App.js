import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import OrderList from './Intents/Sitemanager/OrderList';
import DraftList from './Intents/Sitemanager/DraftList';
import AddOrder from './Intents/Sitemanager/AddOrder';
import Limit from "./Intents/Limit";
import Item from "./Intents/Item";
import {Component} from 'react';
import * as firebase from 'firebase';
import OrderView from './Intents/Sitemanager/OrderView';
import UpdateOrder from './Intents/Sitemanager/UpdateOrder';
import UseDraft from './Intents/Sitemanager/UseDraft';
import Budget from "./Intents/Budget";
import Home from './Intents/Home';
import returnView from './Intents/Sitemanager/returnView';
import Login from "./Intents/Login/Login";

const firebaseConfig = {
    apiKey: 'AIzaSyBdjP3em_r5nnmOc0e69TRXxq5kUHGYXNc',
    authDomain: 'procurement-a8350.firebaseapp.com',
    databaseURL: 'https://procurement-a8350.firebaseio.com',
    projectId: 'procurement-a8350',
    storageBucket: 'procurement-a8350.appspot.com',
    messagingSenderId: '1040527104801',
    appId: '1:1040527104801:web:ea85e364f1c508d0673c60',
    measurementId: 'G-V79HW2S579',
};
firebase.initializeApp(firebaseConfig);

export default class App extends Component {

    render() {
        const Drawer = createDrawerNavigator();

        return (
            <NavigationContainer>
                <Drawer.Navigator initialRouteName="Login">
                    <Drawer.Screen name="Home" component={Home}/>
                    <Drawer.Screen name="OrderList" component={OrderList}/>
                    <Drawer.Screen name="DraftList" component={DraftList}/>
                    <Drawer.Screen name="Limit" component={Limit} />
                    <Drawer.Screen name="Item" component={Item} />
                    <Drawer.Screen name="Budget" component={Budget} />
                    <Drawer.Screen name="AddOrder" component={AddOrder} options={{
                        drawerLabel: () => null,
                        title: null,
                        drawerIcon: () => null,
                    }}/>
                    <Drawer.Screen name="OrderView" component={OrderView} options={{
                        drawerLabel: () => null,
                        title: null,
                        drawerIcon: () => null,
                    }}/>

                    <Drawer.Screen name="UpdateOrder" component={UpdateOrder} options={{
                        drawerLabel: () => null,
                        title: null,
                        drawerIcon: () => null,
                    }}/>

                    <Drawer.Screen name="UseDraft" component={UseDraft} options={{
                        drawerLabel: () => null,
                        title: null,
                        drawerIcon: () => null,
                    }}/>
                    <Drawer.Screen name="returnView" component={returnView} options={{
                        drawerLabel: () => null,
                        title: null,
                        drawerIcon: () => null,
                    }}/>
                    <Drawer.Screen name="Login" component={Login} />

                </Drawer.Navigator>
            </NavigationContainer>
        );
    }

}
