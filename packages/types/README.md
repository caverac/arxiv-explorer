# Types

These are types used across the Arxiv Explorer project. They are defined in a way that allows them to be shared between different packages, such as the API and the Chrome extension. 

For the most part, types are defined using zod, a TypeScript-first schema declaration and validation library. This allows us to define types that can be used for both runtime validation and TypeScript type checking.