import React, {useState} from 'react'
import {useAragonApi} from '@aragon/api-react'
import {Main, TabBar, SidePanel} from '@aragon/ui'
import styled from 'styled-components'

import {setAgent} from "./web3/TemplateAgentContract";

import AppLayout from "./components/app-layout/AppLayout"
import Settings from "./components/settings/Settings"
import Content from "./components/Content";
import GenericInputPanel from "./components/side-panel-input/GenericInputPanel";

// TODO: Extract common views into independant components.
// TODO: Put thought into extracting tabs and or side panel components, requires recreating or passing in aragon api instance.
// TODO: Investigate and use the syncing state.

function App() {

    const {api, appState} = useAragonApi()
    const {syncing} = appState
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
        <Main>

            <AppLayout title='Template Agent'
                       tabs={(<TabBar
                           items={tabsNames}
                           selected={tabBarSelected}
                           onChange={setTabBarSelected}/>)}>

                {selectedTabComponent}

            </AppLayout>

            <SidePanel title={sidePanel ? sidePanel.title : ''} opened={sidePanel !== undefined}
                       onClose={() => closeSidePanel()}>
                {sidePanel ? sidePanel.sidePanelComponent : <div/>}
            </SidePanel>
        </Main>


    )
}

const Syncing = styled.div.attrs({children: 'Syncing…'})`
  position: absolute;
  top: 15px;
  right: 20px;
`

export default App
