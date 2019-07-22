import React, {useState} from 'react'
import {useApi, useAppState} from '@aragon/api-react'
import {Main, TabBar, SidePanel, SyncIndicator} from '@aragon/ui'

import AppLayout from "./components/app-layout/AppLayout"
import Settings from "./components/settings/Settings"
import Content from "./components/Content";
import {useSidePanels} from "./app-side-panels";

// TODO: Put thought into extracting tabs and or side panel components, requires recreating or passing in aragon api instance.

function App() {

    const api = useApi()
    const appState = useAppState()

    const {isSyncing} = appState
    const [tabBarSelected, setTabBarSelected] = useState(0)

    const {
        openSidePanel,
        openSidePanelActions,
        closeSidePanel
    } = useSidePanels(api)

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
                          handleNewAgent={() => openSidePanelActions.changeAgent()}
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

                <SidePanel title={openSidePanel ? openSidePanel.title : ''}
                           opened={openSidePanel !== undefined}
                           onClose={() => closeSidePanel()}
                >
                    {openSidePanel ? openSidePanel.sidePanelComponent : <div/>}
                </SidePanel>
            </Main>
        </div>
    )
}

export default App
