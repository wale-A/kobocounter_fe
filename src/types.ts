export type User = {
  id: string;
  email: string;
  name: string;
  token: { token: string };
};

export type State = {
  user?: User;
};
