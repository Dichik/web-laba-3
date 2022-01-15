class RequestHelper {
    API_URL = _api_url;

    async fetchGraphQL(operationsDoc, operationName, variables) {
        const result = await fetch(this.API_URL, {
            method: 'POST',
            body: JSON.stringify({
                query: operationsDoc,
                variables: variables,
                operationName: operationName
            })
        });

        return result.json();
    }

    fetchMyQuery(operationsDoc) {
        return this.fetchGraphQL(operationsDoc, 'MyQuery', {});
    }

    async startFetchMyQuery(operationsDoc) {
        const { errors, data } = await this.fetchMyQuery(operationsDoc);
        if (errors) {
            throw new Error(errors[0].message);
        }
        return data;
    }

    executeMyMutation(operationsDoc) {
        return this.fetchGraphQL(operationsDoc, 'MyMutation', {});
    }

    async startExecuteMyMutation(operationsDoc) {
        const { errors, data } = await this.executeMyMutation(operationsDoc);
        if (errors) {
            throw new Error(errors[0].message);
        }
        return data;
    }
}

export default new RequestHelper();
