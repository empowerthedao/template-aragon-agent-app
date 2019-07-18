import React from "react"
import {Text, Card, Button} from "@aragon/ui"
import styled from 'styled-components'

const SettingsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
`
const DetailContainer = styled.div`
    display: flex;
    flex-direction: column;
    border-style: solid;
    border-width: 1px;
    border-radius: 5px;
    border-color: rgb(179,179,179);
    padding: 10px;
    margin-bottom: 30px;
`
const AddressCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
    width: auto;
`
const ControllerAddressCard = styled(Card)`
    padding: 10px;
    height: auto;
    margin-top: 10px;
    margin-bottom: 15px;
    width: auto;
`
const ButtonContainer = styled.div`
    display: flex;
`

const Settings = ({handleNewAgent, appState}) => {
    const {appAddress, agentAddress} = appState

    return (
        <SettingsContainer>
            <div>

                <DetailContainer>
                    <Text.Block size="normal">Agent Address</Text.Block>
                    <ControllerAddressCard>
                        <Text.Block size="normal">{agentAddress}</Text.Block>
                    </ControllerAddressCard>

                    <ButtonContainer>
                        <Button mode="strong" onClick={() => handleNewAgent()}>
                            Change Agent
                        </Button>
                    </ButtonContainer>
                </DetailContainer>

                <DetailContainer>
                    <Text.Block size="normal">Template Agent Address</Text.Block>
                    <AddressCard>
                        <Text.Block size="normal">{appAddress}</Text.Block>
                    </AddressCard>
                </DetailContainer>

            </div>

        </SettingsContainer>
    )
}

export default Settings