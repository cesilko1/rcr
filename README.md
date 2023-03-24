# RCR

**React call rest**

This library is inspired by the [SWR](https://swr.vercel.app/) library but is more lightweight and developer-friendly. It comes with TypeScript support and types are included in the package. It has a slightly different API for using hooks than the mentioned SWR.


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

You need to define *fetcher function* for fetching user by *userId*:

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
