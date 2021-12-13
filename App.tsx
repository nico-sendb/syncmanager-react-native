import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SendBird, { AdminMessage, BaseChannel, BaseMessageInstance, FileMessage, GroupChannel, GroupChannelContext, GroupChannelOrder, MessageCollection, MessageContext, SendBirdError, SendBirdInstance, User, UserMessage } from 'sendbird';
import { StatusBar } from 'expo-status-bar';
import SendBirdSyncManager from 'sendbird-syncmanager';

/**
 * SET YOUR SENDBIRD INFORMATION HERE
 */
const APP_ID = 'YOUR APP ID HERE';
var USER_ID = 'YOUR USER ID HERE';
var ACCESS_TOKEN: any = null;
var sb: SendBirdInstance;


/**
 * INIT SENDBIRD AND CONNECT
 */
function initAndConnect(callback: any) {
    // Init Sendbird
    sb = new SendBird({ appId: APP_ID });
    // Connect to chat
    sb.connect(USER_ID, ACCESS_TOKEN, (user: User, error: SendBirdError) => {
        if (error) {
            console.log('Unable to connect. You need to get a first connection to access Local Cache');
            callback(null);
        } else {
            callback(user);
        }
    })
}


function initSyncManager(callback: any) {
    const options: any = new SendBirdSyncManager.Options();
    options.messageCollectionCapacity = 2000;
    options.messageResendPolicy = 'manual';
    options.maxFailedMessageCountPerChannel = 5;

    SendBirdSyncManager.sendBird = sb;
    SendBirdSyncManager.setup(USER_ID, options)
        .then(() => {
            console.log('At this point, the database is ready.');
            console.log('You may not assume that a connection is established here.');
            callback();
        })
        .catch(error => {
            console.log('SyncManager init failed: ', error);
        });
}

function fetchChannels() {
    const listQuery = sb.GroupChannel.createMyGroupChannelListQuery();
    const collection = new SendBirdSyncManager.ChannelCollection(listQuery);
    const handler = new SendBirdSyncManager.ChannelCollection.CollectionHandler();

    handler.onChannelEvent = (action, channels) => {
        switch (action) {
            case 'insert':
                console.log('Add channels to the view.');
                console.log(channels);
                break;
            case 'update':
                console.log(' Update channels in the view.');
                console.log(channels);
                break;
            case 'move':
                console.log(' Change the position of channels in the view.');
                console.log(channels);
                break;
            case 'remove':
                console.log('Remove channels from the view.');
                console.log(channels);
                break;
            case 'clear':
                console.log('Clear the view.');
                console.log(channels);
                break;
        }
    };
    collection.setCollectionHandler(handler);
    collection.fetch();
}


/**
 * Let's begin...
 */
initAndConnect((user: User) => {
    console.log('Connected to sendbird', user);
    initSyncManager(() => {
        fetchChannels();
    });
})


export default function App() {
    return (
        <View style={styles.container}>
            <Text>Open up App.tsx to start working on your app!</Text>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
