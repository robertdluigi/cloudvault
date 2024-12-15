// GraphQL queries


export const LOGIN_QUERY = `
  mutation Login($email: String!, $password: String!) {
    auth {
      login(email: $email, password: $password)
    }
  }
`;