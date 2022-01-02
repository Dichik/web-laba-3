<script>
    import http from './helper/request-helper';
    import {OperationDocsHelper} from "./helper/operation-docs-helper";
    import {ApolloClient, InMemoryCache} from '@apollo/client';
    import {setClient, subscribe} from "svelte-apollo";
    import {WebSocketLink} from "@apollo/client/link/ws";
    import './styles/global.css'

    function createApolloClient() {
        try {
            const wsLink = new WebSocketLink({
                uri: "wss://web-laba3-2.herokuapp.com/v1/graphql",
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
            console.log(ERROR_MESSAGE + e)
        }
    }

    const ERROR_MESSAGE = 'Something went wrong... see exception: ';
    let deadlineError = false
    let client;
    let tasks;
    try {
        client = createApolloClient()
        setClient(client)
        tasks = subscribe(OperationDocsHelper.SUBSCRIPTION_AllTodos)
    } catch (e) {
        console.log(ERROR_MESSAGE + e)
    }

    const convertToNumber = (string) => {
        return isNaN(+string) ? 0 : +string;
    }
    // prettier-ignore
    // TODO add update

    // prettier-ignore
    // TODO add search (search by)

    // prettier-ignore
    // TODO pagination

    const addTask = async () => {
        // prettier-ignore
        // FIXME use smth instead of prompts

        if(!window.navigator.onLine) {
            alert('Ooops, something went wrong, please check your connection.')
            return
        }

        const name = prompt("Task name: ") ?? "";
        const priority = convertToNumber(prompt("Task priority: ") ?? "");
        const deadline = prompt("Deadline: ") ?? "";

        if(!name.trim() || !deadline.trim() || !deadline.trim()) {
            alert("You entered empty string(s)... or there is some troubles, try again")
            return
        }

        if(Date.parse(deadline) < Date.now()) {
            alert("can't we live past... but future we can change, man")
            return
        }

        try {
            await http.startExecuteMyMutation(OperationDocsHelper.MUTATION_InsertOne(name, priority, deadline));
        } catch (e) {
            console.log(ERROR_MESSAGE + e);
            alert('Ooops, something went wrong, please check your connection.')
        }
    }

    const deleteTasks = async () => {
        if(!window.navigator.onLine) {
            alert('Ooops, something went wrong, please check your connection.')
            return
        }

        try {
            await http.startExecuteMyMutation(OperationDocsHelper.DELETE_DONE_TASKS());
            // open(MessageBox, {modalText: "Success!"})
        } catch (e) {
            console.log(ERROR_MESSAGE + e);
            alert('Ooops, something went wrong, please check your connection.')
        }
    }

    const getDoneFromId = async (id) => {
        if(!window.navigator.onLine) {
            alert('Ooops, something went wrong, please check your connection.')
            return
        }

        try {
            const {train_todolist} = await http.startFetchMyQuery(OperationDocsHelper.GET_UPDATE_AT(id));
            if(train_todolist.length !== 0)
                return train_todolist[0].done;
        } catch (e) {
            console.log(ERROR_MESSAGE + e)
        }
    }

    const markTask = async (id) => {
        if(!window.navigator.onLine) {
            alert('Ooops, something went wrong, please check your connection.')
            return
        }

        try {
            let flag = await getDoneFromId(id)
            await http.startExecuteMyMutation(OperationDocsHelper.UPDATE_DONE(id, !flag))
        } catch (e) {
            console.log(e)
        }
    }

    // TODO pagination offset, limit, etc...
</script>

<main class="main-style">
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
</main>

<style>
    .centerize {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>