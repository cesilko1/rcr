# RCR

**React call rest**

This library, which contains a set of React hooks, was created to simplify the API calls from React components and to enhance the developer experience through its universality, simplicity, and built-in TypeScript support.

The library is suitable for applications with dynamic data rather than those with static data. In the future, WebSocket support will definitely be added.

Feel free to open a pull request, issue or leave a feedback.

## Installation

### npm
```sh
npm i @vilem/rcr
```

### yarn
```sh
yarn add @vilem/rcr
```

## Content

Hooks:

  * `useFetchApi` - fetch data on component mount
  * `useLazyFetchApi` - fetch data after calling callback
  * `useMutateApi` - send tata to server

Components:

  * `RCRProvider` - component for wrapping applicatio with default RCR config

## Usage

### useFetchApi

The *useFetchApi* hook simplifies calling asynchronous APIs in React and automatically revalidates data upon argument changes. It's ideal for fetching data for display in an application and executes the fetcher function immediately upon mounting. It improves performance and is valuable for building dynamic user interfaces.

#### Example

You need to define a *fetcher function*, the *fetch api*, *axios* or whatever you want can be used in the fetcher function.

```typescript
// userApi.ts
export interface User {
  name: string
}

export const getUser = async (userId: number): Promise<User> => {
  return (await axios.get(`/users/${userId}`)).data;
}
```

Using hook in component:

```tsx
// User.tsx
import { getUser } from './userApi.ts';
import { useFetchApi } from '@vilem/rcr';

export default User = () => {
  const request = useFetchApi(getUser, 1);

  // a configuration object can also be used
  const requestWithOptions = useFetchApi(getUser, {
    revalidateOnArgsChange: false,
    revalidateOnFocus: false
  }, 1)

  if (request.loading || request.revalidating) return (
    <div>
      Loading...
    </div>
  )

  return (
    <div>
      <p>User name: {request.data.name}</p>
    </div>
  )
}
```

The *request* object:

  * `call` - Function that reloads all data
  * `loading` - Boolean that indicates the first loading of data
  * `data` - This is the returned value of fetcher function
  * `errorMessage` - Error message which is thrown by fetcher function
  * `revalidate` - Function which performs like *call* but *loading* is false while revalidating
  * `revalidating` - Boolean that indicates revalidation
