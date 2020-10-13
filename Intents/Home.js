import React from 'react';
import {Component} from 'react';
import {View, Button, FlatList, Text, ScrollView, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


class Home extends Component{
    render(){
        return(
            <View>
                <Icon
                    style={styles.icon}
                    onPress={() => this.props.navigation.openDrawer()}
                    name="md-menu"
                    size={30}
                />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 20,
        justifyContent: 'center',
        textAlign: 'center',
    },
    icon: {
        padding:10,
        fontWeight:'bold'
    },
});
export default Home
