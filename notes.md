## W12D1
# Normalized State w/ Jbuilder

---

## Learning Objectives
+ Review Redux + Rails
+ Understand how to use Jbuilder to sculpt JSON responses
+ Understand why we should normalize our redux state shape

---

## Agenda

+ Demo Review
+ Today's Material
  + Using Jbuilder
  + Normalizing State Shape
  + Common Bugs
+ Kahoot

---

## Demo Review what we've done so far!

- UseSelector
    - prebuilt selectors
        - look at teaReducer.js
    - whenever state gets updated, useSelector gets invoked
    - useSelector requires a callback function that has state as the argument
    - update to state results in the rerendering of all components that are subscribed to the state
    - useSelector here lets us hook into the current state and update our TeaIndex
    - whenever the return value has a different value than the previous state,
    - it causes the component to rerender
    - rerenders are based off of the change in slice of state in the callback of that useSelector

---

## Jbuilder Basics

+ `Jbuilder` is a simple DSL tool to declare JSON structures 
  + Will help us sculpt response objects
+ This will replace the `render json: variable` of a controller's action
  + Instead, we will be rendering a `.json.jbuilder` file
    + Similar to rendering a view
    - similar to html erb instead now we're using jbuilder
        - gives us methods to call on the json object to modify it


---

## Jbuilder Common Methods

+ `extract!`
+ `set!`
+ `array!`
+ `partial!`

- There are more methods on the official docs but these should suffice for now

Fun Fact:
"!" means its a json method, not a key of a pojo.

---

## `extract!`

`extract!` is best used when you want the object's key to match the column name.

```ruby
  # @pupper = { id: 10, name: 'Phil', age: 2 }

  json.extract! @pupper, :name, :age
  # the response will then extract a object with those select key value pairs is.
```

```json
  {"name": "Phil", "age": "2"}
```

---

## `set!`

`set!` is best used when you need to dynamically create a key

```rb
  # @dog = { id: 10, name: 'Phil' }

  json.set! @dog.id do
    json.extract! @dog, :name
  end
  # this sets the key to be the return value of that method call there
```

```json
  { "10" : { "name": "Phil" } }
```

---

## `array!`

You can also extract attributes from an array directly.

```rb
  # @puppinos = [
  #    { id: 10, name: 'Phil', fluffy: true},
  #    { id: 15, name: 'Niko', fluffy: false }
  #    ]

  json.array! @puppinos, :fluffy, :name

  # basically json.extract but from an array
  # @puppinos is an active record collection object which is an array like object

```

```json
  [
      {"name": "Phil", "fluffy": true}, 
      {"name": "Niko", "fluffy": false}
  ]
```

---

## `partial!`

```rb
  #partial in `api/puppers/_pupper.json.jbuilder`

  json.partial! 'pupper', pupper: @pupper
  # the '' represents the partial file name
  # the partial normally contains an _ but we dont include that here
  # use key value pairs to pass in to our partial just like we did for erbs
```

```json
  {"name": "Phil", "age": "2"}
```

---

## Code Demo Part 2 - Reworking controller actions to curate data using JBuilder

- Create views in your app folder
- views/api/teas/index.json.jbuilder
- Make sure to restart rails whenever you change your file structure
- Json keys will always be converted into strings
---

## Break

---

## Organizing your state shape

* Disorganized State:
  * easy to setup
  * harder to make changes in reducers
  * confusing and buggy, impossible to access from components
* Organized State:
  * takes intention to maintain
  * easier to make changes in reducers
  * more consistent and predictable to access from components

#### If you don't organize your store well, you end up doing more work.

---

## What is normalization?

---

## Bad State

```js
  const posts = [
    {
      id : 1,
      author : { id: 1, username : "user1", name : "User 1" },
      body : "......",
      comments : [
        {
          id : 1,
          author : { id: 2, username : "user2", name : "User 2" },
          body : ".....",
        },
        {
          id : 2,
          author : { id: 3, username : "user3", name : "User 3" },
          body : ".....",
        }
      ],
      likers : [
        {
          id : 1,
          username : "user2", 
          name : "User 2"
        },
        {
          id : 2,
          username : "user3",
          name : "User 3"
        }
      ]
    }
  ]
```
    - this is bad
        - lets say you want to change a comment, you have to iterate through your array which makes it O(n) complexity
        - Things are too nested and requires a lot of effort to parse through



---

![drake-nah](https://img2.thejournal.ie/answer/56053/rectangle/?width=260&version=53089)

---

## Good State

```js
  {
    posts : {
      1 : {
        id : 1,
        authorId : 1,
        body : "......",
        commentIds : [1, 2]
      }
    },
    comments : {
      1 : {
        id : 1,
        authorId : 2,
        body : ".....",
      },
      2 : {
        id : 2,
        authorId : 3,
        body : ".....",
      },
    },
    users : {
      1 : {
        id: 1,
        username : "user1",
        name : "User 1",
      },
      2 : {
        id: 2,
        username : "user2",
        name : "User 2",
      },
      3 : {
        id: 3,
        username : "user3",
        name : "User 3",
      }
    }, 
    likes : {
      1 : {
        id: 1,
        postId: 2,
        userId: 1
      },
      2 : {
        id: 2,
        postId: 1,
        userId: 2
      },
      3 : {
        id: 3,
        postId: 3,
        userId: 2
      }
    }
  }
```
    - good state
        - We wouldn't want to store the entire object in a nested data structure which is why there is a commentIds for posts
        - keep all the relevant information as part of that slice of state
        - Easy look up by their ids
        - Can rely on multiple reducers to change their specific slice of state instead of only one
        

---

![drake-yah](https://img2.thejournal.ie/answer/56054/rectangle/?width=260&version=53090)

---

## Why Normalize State Shape
* Duplicated data is hard to manage
* Given an item's ID, we can access it instantaneously 
  * Think back to Big O day
* Avoid complex logic in reducers to handle deeply nested objects
    - having reducers handle slice of state of just a specific object is much better than on e reducer
* Avoid unnecessary re-renders of connected components 
    - if we change anything in that deeply nested state, due to the parent/child relationship between state, everything will be rerendered compared to just one

[Source](https://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html)
  
---

### When you realize your state shape is bad

![sad-panda](https://media.giphy.com/media/14aUO0Mf7dWDXW/giphy.gif)

### 2 days before your project is due

---

## How to Normalize State Shape

+ Each type of data gets its "table" in the state.
    - represents tables in our db schema
    - this also includes joins tables
+ POJO where keys are IDs of items, and values are item objects themselves.
+ Any references to other individual items should be done by storing the item's ID.
+ Arrays of IDs should be used to indicate ordering.

---

## Normalizing associated data

* Data with `belongs_to` relationship stores ID of associated data
* Data with `has_many` relationship stores array of IDs of associated data
- with the `belongs_to` and `has_many` associations, you have access to activeRecord queries
    - Ex: transactions.all and teas.all
        - If we want to query our green tea, we would do teas.first to grab it
        - In order to fetch all the entities that are associated with that, we could do Tea.first.transactions to get all the transactions of green Tea
    - Another ex: Tea.first.transactions_ids
        - this gives us all the transaction_ids of the first Tea (green tea)
* Joins tables occupy their own slice of state

---

## Jbuilder case sensitivity

+ ruby to javascript
  + user_id ==> userId
+ Your redux state follows javascript convention.

```ruby
  # environment.rb
  Jbuilder.key_format camelize: :lower
  # column names that come with '_' will be converted to camelCase
  # this environment.rb file is in your config file
```

---

## Demo Part 3 - Fetching a Tea Detail

---

## [Kahoot!](https://play.kahoot.it/v2/?quizId=e5e638fb-5857-4e04-9774-0906dfcaf5ce)

---

## Future State Shape

```js
  {
    entities: {
      stocks: {
        1: {
          id: 1,
          name: "Starbucks",
          ticker: "SBUX",
          price: 52.00
        },
        2: {
          id: 2,
          name: "Twitter",
          ticker: "TWTR",
          price: 31.96
        },
        3: {
          id: 3,
          name: "Microsoft",
          ticker: "MSFT",
          price: 106.43
        },
      },
      users: {
        1: {
          id: 1,
          username: "Warren Buffett",
          imgUrl: "https://s3.amazonaws.com/easytrade/filename"
        },
        2: {
          id: 2,
          username: "Jordan Belfort",
          imgUrl: "https://s3.amazonaws.com/easytrade/filename"
        }
      },
      watches: { // joins table between stocks and users
        1: {
          id: 1,
          stockId: 3,
          userId: 1
        },
        2: {
          id: 2,
          stockId: 1,
          userId: 3
        },
        3: {
          id: 3,
          stockId: 3,
          userId: 2
        }
      },
    },
    ui: {
      loading: true/false
    },
    errors: {
      login: ["Incorrect username/password combination"],
      tradeForm: ["Not enough buying power"],
    },
    session: { currentUserId: 1 }
  }
```

---

## When you hit a bug

1) Check if webpack is running
1) Check webpack's output
1) Check rails server logs

---

## Backend Errors

+ 404 Not Found
  + Check server log. Check routes.
+ 500 Internal
  + Check server log. Check params. Check controller.
  + Maybe coming from your database (missing validations)

---

## Frontend Errors

+ Importing (curly braces or no curly braces?)
+ Forgetting to export JSX components

---

## Thank you!
