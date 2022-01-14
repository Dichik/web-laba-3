<script>
    import http from './helper/request-helper';
    import {OperationDocsHelper} from "./helper/operation-docs-helper";
    import {ApolloClient, InMemoryCache} from '@apollo/client';
    import {setClient, subscribe} from "svelte-apollo";
    import {WebSocketLink} from "@apollo/client/link/ws";
    import './styles/global.css'
    import Modal, {bind} from 'svelte-simple-modal'
    import {modal} from './store'
    import MessageBox from './componenets/Message.svelte'

    let uri_link = _uri_apollo_client

    let defaultValue = ""

    let name = defaultValue
    let priority = defaultValue
    let deadline = defaultValue

    function createApolloClient() {
        try {
            const wsLink = new WebSocketLink({
                uri: uri_link,
                options: {
                    reconnect: true,
                }
            });
            const cache = new InMemoryCache();
            return new ApolloClient({
                link: wsLink,
                cache
            })
        } catch (e) {
            modal.set(bind(MessageBox, { message: ("Error: " + e)}));
        }
    }

    const ERROR_MESSAGE = 'Something went wrong... see exception: ';
    let client;
    let tasks;
    try {
        client = createApolloClient()
        setClient(client)
        tasks = subscribe(OperationDocsHelper.SUBSCRIPTION_AllTodos)
    } catch (e) {
        modal.set(bind(MessageBox, { message: ("Error: " + e)}));
    }

    const convertToNumber = (string) => {
        return isNaN(+string) ? 0 : +string;
    }

    const addTask = async () => {

        if(!window.navigator.onLine) {
            modal.set(bind(MessageBox, { message: ('Ooops, something went wrong, please check your connection.')}));
            return
        }

        // const name = prompt("Task name: ") ?? "";
        // const priority = convertToNumber(prompt("Task priority: ") ?? "");
        // const deadline = prompt("Deadline: ") ?? "";

        if(!name.trim() || !deadline.trim()) {
            modal.set(bind(MessageBox, { message: ("You entered empty string(s)... or there is some troubles, try again")}));
            return
        }

        if(Date.parse(deadline) < Date.now()) {
            modal.set(bind(MessageBox, { message: ("can't we live past... but future we can change, man")}));
            return
        }

        try {
            await http.startExecuteMyMutation(OperationDocsHelper.MUTATION_InsertOne(name, priority, deadline));
            modal.set(bind(MessageBox, { message: ("Success!")}));
            backToDefault();
        } catch (e) {
            modal.set(bind(MessageBox, { message: ('Ooops, something went wrong, please check your connection.' + e)}));
        }
    }

    const backToDefault = () => {
        name = defaultValue
        priority = defaultValue
        deadline = defaultValue
    }

    const deleteTasks = async () => {
        if(!window.navigator.onLine) {
            modal.set(bind(MessageBox, { message: ('Ooops, something went wrong, please check your connection.')}));
            return
        }

        try {
            await http.startExecuteMyMutation(OperationDocsHelper.DELETE_DONE_TASKS());
            modal.set(bind(MessageBox, { message: ("Success!")}));
        } catch (e) {
            modal.set(bind(MessageBox, { message: ("Error: " + e)}));
        }
    }

    const getDoneFromId = async (id) => {
        if(!window.navigator.onLine) {
            modal.set(bind(MessageBox, { message: ('Ooops, something went wrong, please check your connection.')}));
            return
        }

        try {
            const {train_todolist} = await http.startFetchMyQuery(OperationDocsHelper.GET_UPDATE_AT(id));
            if(train_todolist.length !== 0)
                return train_todolist[0].done;
        } catch (e) {
            throw ERROR_MESSAGE + " : " + e;
        }
    }

    const markTask = async (id) => {
        if(!window.navigator.onLine) {
            modal.set(bind(MessageBox, { message: ('Ooops, something went wrong, please check your connection.')}));
            return
        }

        try {
            let flag = await getDoneFromId(id)
            await http.startExecuteMyMutation(OperationDocsHelper.UPDATE_DONE(id, !flag))
        } catch (e) {
            modal.set(bind(MessageBox, { message: ('Ooops, something went wrong, please check your connection. See error: ' + e)}));

        }
    }

    // TODO pagination offset, limit, etc...
</script>

<main class="main-style">
    <Modal show={$modal}>
        {#if $tasks.loading}
        <div class="centerize">
            <h1>Loading...</h1>
        </div>
        {:else if $tasks.error}
            <div>Error!</div>
        {:else if $tasks.data}
            <button class="button-style" on:click={addTask}>Add task</button>
            <button class="button-style" on:click={deleteTasks}>Delete Done</button>
            <button class="button-style">Update Task</button>

            <div class="input-fields">
                <label>
                    Task Name <input bind:value={name} class="input-field-style">
                </label>
                <label>
                    Priority <input bind:value={priority} class="input-field-style">
                </label>
                <label>
                    Deadline <input bind:value={deadline} class="input-field-style">
                </label>
            </div>

            <table border="1" class="table-centerize">
                <caption class="table-global-style">Tasks</caption>
                <tr class="table-global-style">
                    <th></th>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Deadline</th>
                    <th>Done</th>
                </tr>
                {#each $tasks.data.train_todolist as t (t.id)}
                    {#if t.done}
                        <tr class="table-global-style rows-style-done">
                            <td>
                                <input type="checkbox" checked={t.done} name="done" on:click={markTask(t.id)} />
                            </td>
                            <td><strike>{t.task}</strike></td>
                            <td><strike>{t.priority}</strike></td>
                            <td><strike>{t.deadline}</strike></td>
                            <td><strike>{t.done}</strike></td>
                        </tr>
                    {:else }
                        <tr class="table-global-style rows-style-notdone">
                            <td>
                                <input type="checkbox" checked={t.done} name="done" on:click={markTask(t.id)} />
                            </td>
                            <td>{t.task}</td>
                            <td>{t.priority}</td>
                            <td>{t.deadline}</td>
                            <td>{t.done}</td>
                        </tr>
                    {/if }
                {/each}
            </table>
        {/if}
    </Modal>
    
</main>

<style>
    .centerize {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>