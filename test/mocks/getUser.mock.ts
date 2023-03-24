export interface User {
  userName: string;
  email: string;
  id: number;
}

export const getUser = async (id: number): Promise<User> => {
  const user: User = {
    id,
    email: `user.${id}@emial.com`,
    userName: `Cool User${id}`,
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(user)
    }, 500);
  });
}

export const getUserWithError = async (id: number): Promise<User> => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return new Promise((resolve, reject) => {
    reject(new Error(`Can not find user with id: ${id}`));
  });
}