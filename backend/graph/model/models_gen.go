// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type AuthOps struct {
	Login    any `json:"login"`
	Register any `json:"register,omitempty"`
}

type Mutation struct {
}

type Query struct {
}

type SignUp struct {
	Username  string `json:"username"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}
