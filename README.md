# CPEN 400A Web App Project

This is our repo for our term long web app project.

* [Assignment-1](https://github.com/juliengs/cpen400a-fall2017-assignment1)
* [Assignment-2](https://github.com/jungkumseok/cpen400a-fall2017-assignment2)
* [Assignment-3](https://github.com/jungkumseok/cpen400a-fall2017-assignment3)
* [Assignment-4](https://github.com/jungkumseok/cpen400a-fall2017-assignment4)
* [Assignment-5](https://github.com/jungkumseok/cpen400a-fall2017-assignment5)

## Server Endpoints

The actual website is hosted at `/` as per the bonus task.

To retrieve the products from the server use `/products/:filter/:user_token`. A
user token must be passed and valid for the request to work, and a filter must
also be passed. To get all products pass the filter `all`.

* Possible filters:
  * all
  * books
  * clothes
  * tech
  * gifts
  * stationary
  * supplies

To return products that are between a price range use
`/products/:min/:max/:user_token`. Again, the user token must be valid and a min
and max value must be passed.

* The checkout endpoint gets sent 3 variables in the post request:
  * cart
  * filter
  * user_token

The cart is the current state of the cart so that the server knows what needs to
be checked out, the filter is passed and can be any of the filters mentioned
above (This is so that the server returns the updated product list for the
currently set filter. ie: if the books filter was set before checkout was
initiated, I want the books filter to still be on when the checkout is done. By
passing the filter I know what items I should return back to the client to serve
up on the page). User token is as normal and needs to be valid for the request
to work.

## URL for Heroku App

[heroku](https://secret-beyond-19352.herokuapp.com/products)

### Some Notes about Heroku and Mongo

Start the heroku server locally with `heroku local web`

If after doing that information still fails to load from mongodb, then make sure
the service is running: `sudo service mongod start`

Enter the mongo shell with `mongo` and see if it is now working.

To load the `initdb.js` file: `load("initdb.js")` from the mongo shell

## Git Hooks

### Pre-Commit Hooks

Create a new file in `.git/hooks/` called `pre-commit`

#### Windows

Use this for the file contents (Make sure that the first line of the script is a
real file and location on your computer):

```bash
#!C:/Program\ Files/Git/usr/bin/sh.exe

# If there are whitespace errors, print the offending file names and fail.
git config core.whitespace "blank-at-eol,space-before-tab,tab-in-indent,blank-at-eof"
exec git diff-index --check --cached HEAD --
```

#### Linux

Use this for the file contents:

```bash
#!/bin/sh

# If there are whitespace errors, print the offending file names and fail.
git config core.whitespace "blank-at-eol,space-before-tab,tab-in-indent,blank-at-eof"
exec git diff-index --check --cached HEAD --
```
