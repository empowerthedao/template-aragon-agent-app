import React, {useState} from 'react'
import {useApi, useAppState} from '@aragon/api-react'
import {Main, TabBar, SidePanel, SyncIndicator} from '@aragon/ui'

import {setAgent} from "./web3/TemplateAgentContract";

import AppLayout from "./components/app-layout/AppLayout"
import Settings from "./components/settings/Settings"
import Content from "./components/Content";
import GenericInputPanel from "./components/side-panel-input/GenericInputPanel";

// TODO: Put thought into extracting tabs and or side panel components, requires recreating or passing in aragon api instance.

function App() {

    const api = useApi()
    const appState = useAppState()

    const {isSyncing} = appState
    const [tabBarSelected, setTabBarSelected] = useState(0)
    const [sidePanel, setSidePanel] = useState(undefined)

    const setAgentAddress = (address) => {
        closeSidePanel()
        setAgent(api, address)
    }

    const closeSidePanel = () => setSidePanel(undefined)

    const sidePanels = {
        CHANGE_AGENT: {
            title: 'Change the Agent',
            sidePanelComponent: (
                <GenericInputPanel actionTitle={'Template Agent Action'}
                                   actionDescription={`This action will change the Agent which represents an EOA and is responsible
                                    for interacting with the ??? protocol.`}
                                   inputFieldList={[
                                       {id: 1, label: 'address', type: 'text'}]}
                                   submitLabel={'Change agent'}
                                   handleSubmit={setAgentAddress}/>
            )
        }
    }

    const tabs = [
        {
            tabName: "Content",
            tabComponent: (
                <Content appState={appState}/>
            )
        },
        {
            tabName: 'Settings',
            tabComponent: (
                <Settings appState={appState}
                          handleNewAgent={() => setSidePanel(sidePanels.CHANGE_AGENT)}
                />
            )
        }
    ]

    const tabsNames = tabs.map(tab => tab.tabName)
    const selectedTabComponent = tabs[tabBarSelected].tabComponent

    return (
        <div css="min-width: 320px">
            <Main>
                <SyncIndicator visible={isSyncing}/>
                <AppLayout title='Template Agent'
                           tabs={(<TabBar
                               items={tabsNames}
                               selected={tabBarSelected}
                               onChange={setTabBarSelected}/>)}>

                    {selectedTabComponent}

                </AppLayout>

                <SidePanel title={sidePanel ? sidePanel.title : ''}
                           opened={sidePanel !== undefined}
                           onClose={() => closeSidePanel()}
                >
                    {sidePanel ? sidePanel.sidePanelComponent : <div/>}
                </SidePanel>
            </Main>
        </div>
    )
}

export default App
