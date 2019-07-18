import '@babel/polyfill'
import {of} from 'rxjs'
import AragonApi from '@aragon/api'
import retryEvery from "./lib/retryEvery"
import {agentAddress$} from "./web3/ExternalContracts";

const DEBUG = true; // set to false to disable debug messages.
const debugLog = message => { if (DEBUG) { console.log(message) }}

const INITIALIZATION_TRIGGER = Symbol('INITIALIZATION_TRIGGER')

const api = new AragonApi()

// Wait until we can get the agents address (demonstrating we are connected to the app) before initializing the store.
retryEvery(retry => {
    agentAddress$(api).subscribe(
        () => initialize(),
        error => {
            console.error(
                'Could not start background script execution due to the contract not loading the agent address:',
                error
            )
            retry()
        }
    )
})

const initialize = () => {
    api.store(onNewEventCatchError, [
        of({event: INITIALIZATION_TRIGGER})
    ])
}

const initialState = async (state) => {
    return {
        ...state,
        agentAddress: await agentAddress$(api).toPromise()
    }
}

const onNewEventCatchError = async (state, event) => {
    try {
        return await onNewEvent(state, event)
    } catch (error) {
        console.error(`Caught error: ${error}`)
    }
}

const onNewEvent = async (state, storeEvent) => {

    const {event: eventName, address: eventAddress} = storeEvent

    switch (eventName) {
        case INITIALIZATION_TRIGGER:
            debugLog("APP INITIALISED")
            return initialState(state)
        case 'AppInitialized':
            debugLog("APP CONSTRUCTOR EVENT")
            api.identify(`Agent App: ${eventAddress}`)
            return {
                ...state,
                appAddress: eventAddress
            }
        case 'NewAgentSet':
            debugLog("NEW AGENT SET")
            return {
                ...state,
                agentAddress: await agentAddress$(api).toPromise()
            }
    }
}

