class RequestHelper {
  API_URL = _api_url;

  async fetchGraphQL(operationsDoc, operationName, variables) {
    try {
      const result = await fetch(this.API_URL, {
        method: "POST",
        body: JSON.stringify({
          query: operationsDoc,
          variables: variables,
          operationName: operationName,
        }),
      });

      return await result.json();
    } catch (e) {
      throw "Error with fetching: " + e;
    }
  }

  fetchMyQuery(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyQuery", {});
  }

  async startFetchMyQuery(operationsDoc) {
    try {
      const { errors, data } = await this.fetchMyQuery(operationsDoc);

      if (errors) {
        console.error(errors);
      }
      console.log(data);
      return data;
    } catch (e) {
      throw "Error with fetching: " + e;
    }
  }

  executeMyMutation(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyMutation", {});
  }

  async startExecuteMyMutation(operationsDoc) {
    try {
      const { errors, data } = await this.executeMyMutation(operationsDoc);

      if (errors) {
        console.error(errors);
      }
      console.log(data);
      return data;
    } catch (e) {
      throw "Error with fetching: " + e;
    }
  }
}

export default new RequestHelper();
