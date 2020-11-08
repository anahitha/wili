import * as React from 'react';
import { Text, View, StyleSheet, TextInput, Image, Alert, KeyboardAvoidingView, ToastAndroid} from 'react-native';
import * as Permissions from 'expo-permissions';
import {BarCodeScanner} from 'expo-barcode-scanner';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as firebase from 'firebase';
import db from '../config.js'; 
 
export default class BorrowScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            hasCameraPermissions: null,
            scanned: false,
            scannedBookID: '',
            scannedStudentID: '',
            buttonState: 'normal',
            transactionMessage: ''
        }
    }
    getCameraPermissions = async(ID)=>{
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions: status == "granted",
            scanned: false,
            buttonState: ID
        })
    }

    handleBarcodeScan = async({type, data})=>{
        const {buttonState} = this.state
        if(buttonState==="BookID"){
        this.setState({
            scanned: true,
            scannedBookID: data,
            buttonState: 'normal'
        })}
        else if(buttonState=="StudentID"){
            this.setState({
                scanned: true,
                scannedStudentID: data,
                buttonState: 'normal'
            })
        }
    }

    initiateBookIssue = async()=>{
        db.collection("transactions").add({
            'studentId': this.state.scannedStudentID,
            'bookId': this.state.scannedBookID,
            'date': firebase.firestore.Timestamp.now().toDate(),
            'transactionType': "Issue"
        })
        db.collection("books").doc(this.state.scannedBookID).update({
            bookAvailable: false
        })
        db.collection("students").doc(this.state.scannedStudentID).update({
            booksIssued: firebase.firestore.FieldValue.increment(1)
        })
        this.setState({
            scannedBookID: '',
            scannedStudentID: ''
        })
    }

    initiateBookReturn = async()=>{
        db.collection("transactions").add({
            'studentId': this.state.scannedStudentID,
            'bookId': this.state.scannedBookID,
            'date': firebase.firestore.Timestamp.now().toDate(),
            'transactionType': "Return"
        })
        db.collection("books").doc(this.state.scannedBookID).update({
            bookAvailable: true
        })
        db.collection("students").doc(this.state.scannedStudentID).update({
            booksIssued: firebase.firestore.FieldValue.increment(-1)
        })
        this.setState({
            scannedBookID: '',
            scannedStudentID: ''
        })
    }

    handleTransaction = async() =>{
        var transactionMessage;
        db.collection("books").doc(this.state.scannedBookID).get()
        .then((doc)=>{
            var book = doc.data();
            if(book.bookAvailable){
                this.initiateBookIssue();
                transactionMessage="Book Issued";
                ToastAndroid.show(transactionMessage, ToastAndroid.SHORT)
            }else{
                this.initiateBookReturn();
                transactionMessage="Book Returned"
                ToastAndroid.show(transactionMessage, ToastAndroid.SHORT)
            }
        })
        this.setState({
            transactionMessage: transactionMessage
        })
    }

    render(){
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;
        if(buttonState !== 'normal' && hasCameraPermissions){
            return(
                <BarCodeScanner 
                onBarCodeScanned = {scanned? undefined: this.handleBarcodeScan} 
                 style = {StyleSheet.absoluteFillObject}>

                </BarCodeScanner>
            )
        }
        else if(buttonState == 'normal'){
            return(
                <KeyboardAvoidingView style = {styles.container} behavior= "padding"enabled>
                    <View>
                        <Image 
                        source= {require("../assets/booklogo.jpg")}
                        style = {{   
                            width: 200,
                            height: 200
                        }}/>
                        <Text style = {{
                            textAlign: 'center',
                            fontSize: 30
                        }}>WiLi</Text>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput style = {styles.inputBox}
                        placeholder="Book ID"
                        onChangeText = {text => this.setState({scannedBookID: text})}
                        value = {this.state.scannedBookID}>
                        </TextInput>
                        <TouchableOpacity style = {styles.scanButton}
                        onPress = {()=>{this.getCameraPermissions("BookID")}}>
                            <Text style = {styles.buttonText}> Scan book ID </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.inputView}>
                        <TextInput style = {styles.inputBox}
                        placeholder="Student ID"
                        onChangeText = {text => this.setState({scannedStudentID: text})}
                        value = {this.state.scannedStudentID}>
                        </TextInput>
                        <TouchableOpacity style = {styles.scanButton}
                        onPress = {()=>{this.getCameraPermissions("StudentID")}}>
                            <Text style = {styles.buttonText}> Scan Student ID </Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style = {styles.submitButton} onPress = { async()=>{this.handleTransaction()}}>
                        <Text style = {styles.submitText} >Submit</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            )
        }
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
        backgroundColor: '#2196F3',
        padding: 10,
        margin: 10
      },
    buttonText:{
        fontSize: 20,
      },
    submitButton:{
        backgroundColor: 'blue',
        padding: 10,
        margin: 10,
        width: 100,
        height: 50
      },
    submitText:{
        fontSize: 20,
        padding: 10,
        margin: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white'

      },
    inputView: {
        flexDirection: 'row',
        margin: 20
    },
    inputBox: {
        width: 200,
        height:40,
        borderWidth: 1.5,
        fontSize: 20
    }
  });