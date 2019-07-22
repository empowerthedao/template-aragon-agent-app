const TemplateAgentApp = artifacts.require('TemplateAgentApp')
import {deployedContract} from "./helpers/helpers"
import {DaoDeployment, Snapshot, TemplateAgentChainSetup} from "./helpers/ChainSetup"

const ANY_ADDR = '0xffffffffffffffffffffffffffffffffffffffff'

contract('TemplateAgentApp', ([rootAccount, ...accounts]) => {

    let chainSetup = new TemplateAgentChainSetup(new Snapshot(web3), new DaoDeployment(rootAccount))
    let templateAgentAppBase, templateAgentApp
    let SET_AGENT_ROLE

    before(async () => {
        await chainSetup.before()

        templateAgentAppBase = await TemplateAgentApp.new()
        SET_AGENT_ROLE = await templateAgentAppBase.SET_AGENT_ROLE()
    })

    beforeEach(async () => {
        await chainSetup.beforeEach()

        const newTemplateAgentAppReceipt = await chainSetup.daoDeployment.kernel
            .newAppInstance('0x1234', templateAgentAppBase.address, '0x', false, {from: rootAccount})
        templateAgentApp = await TemplateAgentApp.at(deployedContract(newTemplateAgentAppReceipt))
    })

    afterEach(async () => {
        await chainSetup.afterEach()
    })

    describe('initialize(address _agent)', () => {

        const agentAddress = accounts[0]

        beforeEach(async () => {
            await templateAgentApp.initialize(agentAddress)
        })

        it('sets correct agent address', async () => {
            const actualAgent = await templateAgentApp.agent()
            assert.strictEqual(actualAgent, agentAddress)
        })

        describe('setAgent(address _agent)', () => {

            it('changes the agent address', async () => {
                const expectedAgentAddress = accounts[1]
                await chainSetup.daoDeployment.acl.createPermission(rootAccount, templateAgentApp.address, SET_AGENT_ROLE, rootAccount)

                await templateAgentApp.setAgent(expectedAgentAddress)

                const actualAgentAddress = await templateAgentApp.agent()
                assert.strictEqual(actualAgentAddress, expectedAgentAddress)
            })

        })
    })

})